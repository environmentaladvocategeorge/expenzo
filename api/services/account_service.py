from datetime import datetime, timezone
import logging
from models.account_model import Account
from db.dynamodb_client import db_client
from schema.account_schema import AccountCreateRequest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AccountService:
    def create_account(self, account_request: AccountCreateRequest):
        account = Account(
            PK="123",
            SK="345",
            Provider=account_request.provider,
            ProviderID=account_request.provider_id,
            EntityType="ACCOUNT",
            EntityData=account_request.entity_data,
            Timestamp=int(datetime.now(timezone.utc).timestamp()),
            Metadata=account_request.metadata,
        )

        item = account.model_dump()

        logger.info("Creating account item: %s", item)
        
        table = db_client.get_table()
        table.put_item(Item=item)
        
        return item
