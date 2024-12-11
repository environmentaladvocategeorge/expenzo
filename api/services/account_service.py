from datetime import datetime, timezone
import logging
from models.account_model import AccountLink
from db.dynamodb_client import db_client
from schema.account_schema import AccountCreateRequest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AccountService:
    def create_account_link(self, account_link_request: AccountCreateRequest):
        account = AccountLink(
            PK='123', 
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
        
        return item
