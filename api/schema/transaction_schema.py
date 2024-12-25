from pydantic import BaseModel
from models.teller import TellerTransaction, PartialTellerTransaction

class TransactionGetResponse(BaseModel):
    transactions: list[TellerTransaction]

class TransactionEditRequest(PartialTellerTransaction):
    pass