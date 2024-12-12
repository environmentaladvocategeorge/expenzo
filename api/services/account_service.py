from datetime import datetime, timezone
from models.account import AccountLink
from db.dynamodb_client import db_client
from schema.account_schema import AccountCreateRequest
from boto3.dynamodb.conditions import Key, Attr
from utils.logger import get_logger

logger = get_logger(__name__)

class AccountService:
    def create_account_link(self, account_link_request: AccountCreateRequest, user_id: str) -> AccountLink:
        """
        Creates a new account link and stores it in the DynamoDB table.

        Args:
            account_link_request (AccountCreateRequest): The request object containing the details needed to create the account link.
            user_id (str): The unique identifier for the user to whom this account link belongs.

        Returns:
            account (AccountLink): The newly created AccountLink object.
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
            account_links (list[AccountLink]): A list of AccountLink objects for the given user ID.
        """
        table = db_client.get_table()

        response = table.query(
            KeyConditionExpression=Key("PK").eq(user_id),
            FilterExpression=Attr("EntityType").eq("Account Link")
        )

        items = response.get("Items", [])
        account_links = [AccountLink(**item) for item in items]

        logger.info("Retrieved account links for user %s: %s", user_id, account_links)

        return account_links
