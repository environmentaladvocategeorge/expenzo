from typing import Optional
from pydantic import BaseModel
from models.teller import TellerTransaction

class TransactionGetResponse(BaseModel):
    transactions: list[TellerTransaction]

class PartialTellerTransactionDetails(BaseModel):
    processing_status: Optional[str] = None
    category: Optional[str] = None

class PartialTellerTransaction(BaseModel):
    details: Optional[PartialTellerTransactionDetails] = None
    running_balance: Optional[float] = None
    description: Optional[str] = None
    id: Optional[str] = None
    date: Optional[str] = None
    account_id: Optional[str] = None
    amount: Optional[float] = None
    type: Optional[str] = None
    status: Optional[str] = None

class TransactionEditRequest(PartialTellerTransaction):
    pass