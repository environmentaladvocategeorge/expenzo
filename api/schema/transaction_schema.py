from pydantic import BaseModel
from models.teller import TellerTransaction

class TransactionGetResponse(BaseModel):
    transactions: list[TellerTransaction]