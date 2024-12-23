from services.teller_service import TellerService
from models.account import Transaction
from db.dynamodb_client import db_client
from boto3.dynamodb.conditions import Key, Attr
from utils.logger import get_logger

logger = get_logger(__name__)

class TransactionService:
    def __init__(self, teller_service: TellerService):
        self.teller_service = teller_service

    def get_transactions(self, user_id: str) -> list[Transaction]:
        """
        Retrieve all transactions for a given user from the database.

        This method queries the database table to fetch all items associated with the specified `user_id`
        that have an `EntityType` of "Transaction". The items are then converted into `Transaction` objects.

        Args:
            user_id (str): The ID of the user for whom transactions are to be retrieved.

        Returns:
            list[Transaction]: A list of `Transaction` objects representing the user's transactions.
        """
        table = db_client.get_table()
        response_transactions = table.query(
            KeyConditionExpression=Key("PK").eq(user_id),
            FilterExpression=Attr("EntityType").eq("Transaction")
        )
        items_transactions = response_transactions.get("Items", [])
        transactions = [Transaction(**item) for item in items_transactions]

        logger.info("Retrieved %d transaactions for user: %s", len(transactions), user_id)

        return transactions
