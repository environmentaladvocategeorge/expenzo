from db.dynamodb_client import db_client
from models.account_model import Account

class AccountService:
    def create_account(self, account: Account):
        item = account.dict()
        table = db_client.get_table()
        table.put_item(Item=item)
        return {"message": "Account created successfully", "item": item}

    def get_account(self, pk: str, sk: str):
        table = db_client.get_table()
        response = table.get_item(Key={"PK": pk, "SK": sk})
        return response.get('Item', None)

    def delete_account(self, pk: str, sk: str):
        table = db_client.get_table()
        table.delete_item(Key={"PK": pk, "SK": sk})
        return {"message": "Account deleted successfully"}
