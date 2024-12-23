from pydantic import BaseModel
from models.transaction import Transaction

class TransactionGetResponse(BaseModel):
    transactions: list[Transaction]