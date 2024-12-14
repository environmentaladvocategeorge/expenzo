import asyncio
from collections import defaultdict
from datetime import datetime, timezone
from typing import Union
from models.teller import CREDIT_SUBTYPES, DEPOSITORY_SUBTYPES
from services.teller_service import TellerService
from models.account import AccountLink
from models.teller import TellerAccountBalance, TellerAccount
from db.dynamodb_client import db_client
from schema.account_schema import AccountCreateRequest, CategorizedAccounts
from boto3.dynamodb.conditions import Key, Attr
from utils.logger import get_logger

logger = get_logger(__name__)

class AccountService:
    def __init__(self, teller_service: TellerService):
        self.teller_service = teller_service

    def create_account_link(self, account_link_request: AccountCreateRequest, user_id: str) -> AccountLink:
        """
        Creates a new account link and stores it in the DynamoDB table.

        Args:
            account_link_request (AccountCreateRequest): The request object containing the details needed to create the account link.
            user_id (str): The unique identifier for the user to whom this account link belongs.

        Returns:
            AccountLink: The newly created AccountLink object.
        """
        account = AccountLink(
            PK=user_id, 
            SK=f"Provider#{account_link_request.provider}#AccountLink#{account_link_request.provider_id}",
            Provider=account_link_request.provider,
            ProviderID=account_link_request.provider_id,
            EntityType="Account Link",
            EntityData=account_link_request.entity_data,
            Timestamp=int(datetime.now(tz=timezone.utc).timestamp()),
            Metadata=account_link_request.metadata
        )

        item = account.model_dump()

        logger.info("Creating account item: %s", item)
        
        table = db_client.get_table()
        table.put_item(Item=item)
        
        return account
    
    def get_account_links(self, user_id: str) -> list[AccountLink]:
        """
        Retrieve all account link objects for a given user ID where EntityType = 'Account Link'.

        Args:
            user_id (str): The user ID whose account links are to be retrieved.

        Returns:
            list[AccountLink]: A list of AccountLink objects for the given user ID.
        """
        table = db_client.get_table()

        response = table.query(
            KeyConditionExpression=Key("PK").eq(user_id),
            FilterExpression=Attr("EntityType").eq("Account Link")
        )

        items = response.get("Items", [])
        account_links = [AccountLink(**item) for item in items]

        logger.info("Retrieved %d account links for user %s", len(account_links), user_id)

        return account_links
    
    async def get_categorized_accounts(self, user_id: str) -> dict[str, list[dict]]:
        """
        Fetch accounts and categorize them into debit and credit groups.

        Args:
            user_id (str): The user ID whose accounts need to be fetched and categorized.

        Returns:
            dict[str, list[dict]]: Categorized accounts with 'debit' and 'credit' keys.
        """
        logger.info("Fetching account links for user %s", user_id)
        account_links = self.get_account_links(user_id)

        if not account_links:
            logger.info("No account links found for %s, returning empty response.", user_id)
            return CategorizedAccounts()
 
        logger.info("Fetching accounts and balances for user %s", user_id)
        all_accounts = await self._fetch_all_accounts(account_links)
        all_balances = await self._fetch_all_balances(account_links, all_accounts)

        logger.info("Combining accounts and balances for user %s", user_id)
        accounts_with_balances = self._combine_accounts_and_balances(account_links, all_accounts, all_balances)

        return self._categorize_accounts(accounts_with_balances)
    
    async def _fetch_all_accounts(self, account_links: list[AccountLink]) -> list[list[TellerAccount]]:
        """
        Fetch all accounts for a list of account links.

        Args:
            account_links (list[AccountLink]): The account links for which accounts need to be fetched.

        Returns:
            list[list[Account]]: A list of lists of Account objects.
        """
        logger.info("Fetching all accounts for %d account links", len(account_links))
        account_data_tasks = [
            self.teller_service.get_accounts(account_link.ProviderID) for account_link in account_links
        ]
        return await asyncio.gather(*account_data_tasks)

    async def _fetch_all_balances(self, account_links: list[AccountLink], all_accounts: list[list[TellerAccount]]) -> list[list[TellerAccountBalance]]:
        """
        Fetch all balances for a list of account links and their corresponding accounts.

        Args:
            account_links (list[AccountLink]): The account links for which balances need to be fetched.
            all_accounts (list[list[Account]]): The accounts corresponding to the account links.

        Returns:
            list[list[AccountBalance]]: A list of lists of AccountBalance objects.
        """
        logger.info("Fetching all balances for accounts")
        balance_tasks = [
            [
                self.teller_service.get_account_balance(account_link.ProviderID, account.id) for account in accounts
            ]
            for account_link, accounts in zip(account_links, all_accounts)
        ]
        return await asyncio.gather(*[asyncio.gather(*tasks) for tasks in balance_tasks])

    def _combine_accounts_and_balances(
        self, account_links: list[AccountLink], all_accounts: list[list[TellerAccount]], all_balances: list[list[TellerAccountBalance]]
    ) -> list[dict]:
        """
        Combine accounts and their balances into a single list.

        Args:
            account_links (list[AccountLink]): The account links.
            all_accounts (list[list[Account]]): The accounts.
            all_balances (list[list[AccountBalance]]): The balances.

        Returns:
            list[dict]: A list of dictionaries containing account details and balances.
        """
        logger.info("Combining accounts and balances")
        accounts_with_balances = []
        for _, accounts, balances in zip(account_links, all_accounts, all_balances):
            for account, balance in zip(accounts, balances):
                accounts_with_balances.append({"details": account, "balance": balance})
        return accounts_with_balances
    
    def _categorize_accounts(self, accounts_with_balances: list[dict[str, Union[TellerAccount, TellerAccountBalance]]]) -> dict[str, CategorizedAccounts]:
        """
        Categorize accounts into debit and credit categories and calculate total balances.

        Args:
            accounts_with_balances (list[dict]): Accounts with their balances.

        Returns:
            dict[CategorizedAccounts]: Categorized accounts with total balances and account details.
        """
        logger.info("Categorizing accounts")
        
        categorized_accounts = defaultdict(lambda: CategorizedAccounts(accounts=[], total_ledger=0, total_available=0))
        
        for account_data in accounts_with_balances:
            subtype = account_data["details"].subtype
            balance = account_data["balance"]

            ledger_balance = balance.ledger
            available_balance = balance.available

            if subtype in DEPOSITORY_SUBTYPES:
                categorized_accounts["debit"].accounts.append(account_data)
                categorized_accounts["debit"].total_ledger += ledger_balance
                categorized_accounts["debit"].total_available += available_balance

            elif subtype in CREDIT_SUBTYPES:
                categorized_accounts["credit"].accounts.append(account_data)
                categorized_accounts["credit"].total_ledger += -ledger_balance
                categorized_accounts["credit"].total_available += available_balance

        return dict(categorized_accounts)
