from models.transaction import Transaction
from services.teller_service import TellerService
from models.teller import TellerTransaction, TellerTransactionDetails
from db.dynamodb_client import db_client
from boto3.dynamodb.conditions import Key, Attr
from utils.logger import get_logger

logger = get_logger(__name__)

class TransactionService:
    def __init__(self, teller_service: TellerService):
        self.teller_service = teller_service

    def get_transactions(self, user_id: str) -> list[TellerTransaction]:
        """
        Retrieve all transactions for a given user from the database, process their EntityData field,
        and map them into TellerTransaction objects.

        Args:
            user_id (str): The ID of the user for whom transactions are to be retrieved.

        Returns:
            list[TellerTransaction]: A list of TellerTransaction objects sorted in descending order by the date field.
        """
        table = db_client.get_table()
        response_transactions = table.query(
            KeyConditionExpression=Key("PK").eq(user_id),
            FilterExpression=Attr("EntityType").eq("Transaction")
        )

        transactions = []
        
        for item in response_transactions.get("Items", []):
            transaction = Transaction(**item)
            entity_data = transaction.EntityData
            transactions.append(TellerTransaction(
                details=TellerTransactionDetails(**entity_data["details"]),
                running_balance=entity_data["running_balance"],
                description=entity_data["description"],
                id=entity_data["id"],
                date=entity_data["date"],
                account_id=entity_data["account_id"],
                amount=float(entity_data["amount"]),
                type=entity_data["type"],
                status=entity_data["status"]
            ))
        
        transactions.sort(key=lambda x: x.date, reverse=True)
        
        logger.info("Retrieved and sorted %d transactions for user: %s", len(transactions), user_id)
        return transactions
