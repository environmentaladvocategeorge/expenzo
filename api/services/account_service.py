import datetime
from models.account_model import Account
from db.dynamodb_client import db_client
from schema.account_schema import AccountCreateRequest

class AccountService:
    def create_account(self, account_request: AccountCreateRequest):
        account = Account(
            PK="123",
            SK="345",
            Provider=account_request.provider,
            ProviderID=account_request.provider_id,
            EntityType="ACCOUNT",
            EntityData=account_request.entity_data,
            Timestamp=int(datetime.utcnow().timestamp()),
            Metadata=account_request.metadata,
        )
        item = account.model_dump()
        table = db_client.get_table()
        table.put_item(Item=item)
        return {"message": "Account created successfully", "item": item}
