from services.account_service import AccountService
from models.account import Account
from db.dynamodb_client import db_client
from schema.account_schema import CategorizedAccounts
from boto3.dynamodb.conditions import Attr
from utils.logger import get_logger

logger = get_logger(__name__)

class SchedulerService:
    def __init__(self, account_service: AccountService):
        self.account_service = account_service

    async def consolidate_account_balances(self):
        """
        Fetch accounts and categorize them into debit and credit groups.

        Args:
            user_id (str): The user ID whose accounts need to be fetched and categorized.

        Returns:
            dict[str, CategorizedAccounts]: Categorized accounts with 'debit' and 'credit' keys.
        """
        account_links = self.account_service.get_account_links()

        if not account_links:
            logger.info("No account links found")
            return {"debit": CategorizedAccounts(), "credit": CategorizedAccounts()}
 
        all_accounts = await self.account_service.fetch_all_accounts(account_links)
        all_balances = await self.account_service.fetch_all_balances(account_links, all_accounts)

        accounts_with_balances = self.account_service.combine_accounts_and_balances(account_links, all_accounts, all_balances)

        account_links_dict = {link.details['enrollment_id']: link for link in account_links}

        for account in accounts_with_balances:
            enrollment_id = account.details.get('enrollment_id')
            account_link = account_links_dict.get(enrollment_id)

            table = db_client.get_table()
            account = Account(
                PK=account_link.PK,
                 SK=f"Provider#{account_link.Provide}#Account#{account_link.ProviderID}",
                Provider= account_link.Provider,
                ProviderID= account_link.ProviderID,
                EntityType="Account",
                EntityData= account.details,
                Timestamp= int
            )
            
            item = account.model_dump()

            try:
                table.put_item(
                    Item=item,
                    ConditionExpression=Attr('PK').not_exists() & Attr('SK').not_exists() 
                )
                logger.info(f"Inserted new account item with PK {account_link.PK} and SK {account_link.ProviderID}")
            except Exception as e:
                logger.warning(f"Item with PK {account_link.PK} and SK {account_link.ProviderID} already exists. Skipping insert.")

        return accounts_with_balances
