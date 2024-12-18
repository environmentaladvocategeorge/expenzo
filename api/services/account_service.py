from collections import defaultdict
from datetime import datetime, timezone
from typing import Union
from models.teller import CREDIT_SUBTYPES, DEPOSITORY_SUBTYPES
from services.teller_service import TellerService
from models.account import AccountLink, Account, Balance
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
    
    def get_account_links(self, user_id: str = None) -> list[AccountLink]:
        """
        Retrieve account link objects. If user_id is provided, it fetches account links for that user.
        If user_id is not provided, it fetches account links for all users across all applications.

        Args:
            user_id (str, optional): The user ID whose account links are to be retrieved. If not provided, fetches all account links.

        Returns:
            list[AccountLink]: A list of AccountLink objects.
        """
        table = db_client.get_table()

        if user_id:
            response = table.query(
                KeyConditionExpression=Key("PK").eq(user_id),
                FilterExpression=Attr("EntityType").eq("Account Link")
            )
        else:
            response = table.scan(
                FilterExpression=Attr("EntityType").eq("Account Link")
            )

        items = response.get("Items", [])
        account_links = [AccountLink(**item) for item in items]

        if user_id:
            logger.info("Retrieved %d account links for user %s", len(account_links), user_id)
        else:
            logger.info("Retrieved %d account links for all users", len(account_links))

        return account_links
    
    def combine_accounts_and_balances(
        self, all_accounts: list[list[TellerAccount]], all_balances: list[list[TellerAccountBalance]]
    ) -> list[dict]:
        """
        Combine accounts and their balances into a single list by matching them directly.

        Args:
            all_accounts (list[list[TellerAccount]]): The accounts.
            all_balances (list[list[TellerAccountBalance]]): The balances.

        Returns:
            list[dict]: A list of dictionaries containing account details and balances.
        """
        logger.info("Combining accounts and balances")
        accounts_with_balances = []

        for account_list in all_accounts:
            for account in account_list:
                matching_balance = None
                for balance_list in all_balances:
                    for balance in balance_list:
                        if balance.account_id == account.id:
                            matching_balance = balance
                            break
                    if matching_balance:
                        break
                    
                if matching_balance:
                    accounts_with_balances.append({
                        "details": account,
                        "balance": matching_balance
                    })
                else:
                    logger.warning(f"No balance found for account_id: {account.id}")

        return accounts_with_balances
    
    async def get_categorized_accounts(self, user_id: str) -> dict[str, CategorizedAccounts]:
        """
        Fetch accounts and categorize them into debit and credit groups.

        Args:
            user_id (str): The user ID whose accounts need to be fetched and categorized.

        Returns:
            dict[str, CategorizedAccounts]: Categorized accounts with 'debit' and 'credit' keys.
        """
        logger.info("Fetching account links for user %s", user_id)
        account_links = self.get_account_links(user_id)

        return self._categorize_accounts(self.get_accounts_and_balances_for_account_links(account_links))
    
    def get_accounts_and_balances_for_account_links(self, account_links: list[AccountLink]) -> list[dict]:
        """
        Retrieve accounts and their corresponding balances for a list of account links in one pass.
        For each account link, it fetches both account and balance data from the database and combines 
        them into dictionaries with the `details` (account) and `balance` (matching balance).

        Args:
            account_links (list[AccountLink]): A list of AccountLink objects for which account and balance data are to be retrieved.

        Returns:
            list[dict]]: A list containing dictionaries with `details` (TellerAccount) and 
                            `balance` (matching TellerAccountBalance) for each account link.
        """
        table = db_client.get_table()
        accounts_and_balances_for_links = []

        for account_link in account_links:
            sort_key_prefix_accounts = f"Provider#{account_link.Provider}#Account#{account_link.ProviderID}#EntityID#"
            sort_key_prefix_balances = f"Provider#{account_link.Provider}#Balance#{account_link.ProviderID}#EntityID#"

            logger.info("Fetching accounts and balances for account link with PK: %s", account_link.PK)

            response_accounts = table.query(
                KeyConditionExpression="PK = :pk and begins_with(SK, :sk_prefix_accounts)",
                ExpressionAttributeValues={
                    ":pk": account_link.PK,
                    ":sk_prefix_accounts": sort_key_prefix_accounts,
                }
            )

            response_balances = table.query(
                KeyConditionExpression="PK = :pk and begins_with(SK, :sk_prefix_balances)",
                ExpressionAttributeValues={
                    ":pk": account_link.PK,
                    ":sk_prefix_balances": sort_key_prefix_balances,
                }
            )

            items_accounts = response_accounts.get("Items", [])
            items_balances = response_balances.get("Items", [])

            accounts = [Account(**item) for item in items_accounts]
            balances = [Balance(**item) for item in items_balances]

            logger.info("Retrieved %d accounts and %d balances for account link with PK: %s", len(accounts), len(balances), account_link.SK)

            accounts_and_balances = []
            for account in accounts:
                matching_balance = None
                for balance in balances:
                    if balance.EntityData.get("account_id") == account.EntityData.get('id'):
                        matching_balance = TellerAccountBalance(
                            ledger=float(balance.EntityData.get("ledger")),
                            account_id=balance.EntityData.get("account_id"),
                            available=float(balance.EntityData.get("available"))
                        )
                        break
                
                if matching_balance:
                    accounts_and_balances.append({
                        "details": TellerAccount(**account.EntityData),
                        "balance": matching_balance
                    })
                else:
                    logger.warning(f"No balance found for account_id: {account.id}")

            accounts_and_balances_for_links.append(accounts_and_balances)

        return [item for sublist in accounts_and_balances_for_links for item in sublist]

    def _categorize_accounts(self, accounts_with_balances: list[dict[str, Union[TellerAccount, TellerAccountBalance]]]) -> dict[str, CategorizedAccounts]:
        """
        Categorize accounts into debit and credit categories and calculate total balances.

        Args:
            accounts_with_balances (list[dict]): Accounts with their balances.

        Returns:
            dict[CategorizedAccounts]: Categorized accounts with total balances and account details.
        """
        logger.info("Categorizing %s accounts", len(accounts_with_balances))
        
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
