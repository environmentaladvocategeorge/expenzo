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
        items_transactions = response_transactions.get("Items", [])
        
        transactions = []
        for item in items_transactions:
            transaction = Transaction(**item)
            
            entity_data = transaction.EntityData

            details = TellerTransactionDetails(
                processing_status=entity_data.get("processing_status"),
                category=entity_data.get("category")
            )

            transactions.append(TellerTransaction(
                details=details,
                running_balance=entity_data.get("running_balance"),
                description=item.get("description"),
                id=item.get("id"),
                date=item.get("date"),
                account_id=item.get("account_id"),
                amount=float(entity_data.get("amount")),
                type=item.get("type"),
                status=item.get("status")
            ))
        
        transactions.sort(key=lambda x: x.date, reverse=True)
        
        logger.info("Retrieved %d transactions for user: %s", len(transactions), user_id)
        return transactions
