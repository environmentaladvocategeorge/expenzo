from pydantic import BaseModel
from models.account import Transaction

class TransactionGetResponse(BaseModel):
    transactions: list[Transaction]