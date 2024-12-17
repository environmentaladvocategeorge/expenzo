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
    
    def get_accounts_for_account_links(self, account_links: list[AccountLink]) -> list[list[TellerAccount]]:
        """
        Retrieve accounts for a list of account links. For each account link, it fetches corresponding account data from the database 
        and converts the `EntityData` field into `TellerAccount` objects.

        Args:
            account_links (list[AccountLink]): A list of AccountLink objects for which account data is to be retrieved.

        Returns:
            list[list[TellerAccount]]: A list of lists containing `TellerAccount` objects for each account link.
        """
        table = db_client.get_table()

        accounts_for_links = []

        for account_link in account_links:
            sort_key_prefix = f"Provider#{account_link.Provider}#Account#{account_link.ProviderID}#EntityID#"

            logger.info("Fetching accounts for account link with PK: %s and sort key prefix: %s", account_link.PK, sort_key_prefix)

            response = table.query(
                KeyConditionExpression="PK = :pk and begins_with(SK, :sk_prefix)",
                ExpressionAttributeValues={
                    ":pk": account_link.PK,
                    ":sk_prefix": sort_key_prefix,
                }
            )

            items = response.get("Items", [])
            accounts = [Account(**item) for item in items]

            logger.info("Retrieved %d accounts for account link with PK: %s", len(accounts), account_link.PK)

            teller_accounts = [TellerAccount(**account.EntityData) for account in accounts]
            accounts_for_links.append(teller_accounts)

        logger.info("Processed %d account links", len(account_links))

        return accounts_for_links
    
    def get_balances_for_accounts(self, account_links: list[AccountLink], accounts: list[list[TellerAccount]]):
        """
        Retrieve the balance for each account by matching their EntityID. Converts the EntityData into TellerBalance objects.
        The ledger and available values are converted from strings to floats.

        Args:
            accounts (list[TellerAccount]): A list of TellerAccount objects for which balance data is to be retrieved.

        Returns:
            list[TellerBalance]: A list of TellerBalance objects for each account.
        """
        table = db_client.get_table()

        balances_for_accounts = []

        for account_link, account_list in zip(account_links, accounts):
            for account in account_list:
                sort_key_prefix = f"Provider#{account_link.Provider}#Balance#{account_link.ProviderID}#EntityID#{account.id}"
                logger.info("Fetching balance for account link with PK: %s and sort key prefix: %s", account_link.PK, sort_key_prefix)

                response = table.query(
                    KeyConditionExpression="PK = :pk and begins_with(SK, :sk_prefix)",
                    ExpressionAttributeValues={
                        ":pk": account_link.PK,
                        ":sk_prefix": sort_key_prefix,
                    }
                )

                items = response.get("Items", [])
                balance = Balance(**items[0])
                teller_balance = TellerAccountBalance(
                    ledger = float(balance.EntityData.ledger),
                    account_id = balance.EntityData.account_id,
                    available=float(balance.EntityData.available)
                )
                balances_for_accounts.append([teller_balance])
        
        return balances_for_accounts
    
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

        if not account_links:
            logger.info("No account links found for %s, returning empty response.", user_id)
            return {"debit": CategorizedAccounts(), "credit": CategorizedAccounts()}
 
        logger.info("Fetching accounts and balances for user %s", user_id)

        all_accounts = self.get_accounts_for_account_links(account_links)
        all_balances = self.get_balances_for_accounts(account_links, all_accounts)

        logger.info("Combining accounts and balances for user %s", user_id)
        accounts_with_balances = self.combine_accounts_and_balances(all_accounts, all_balances)

        return self._categorize_accounts(accounts_with_balances)
    
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
