from typing import Optional
from pydantic import BaseModel
from models.teller import TellerTransaction

class TransactionGetResponse(BaseModel):
    transactions: list[TellerTransaction]

class TellerTransactionDetails(BaseModel):
    processing_status: Optional[str]
    category: Optional[str]
    
class TransactionEditRequest(BaseModel):
    details: Optional[TellerTransactionDetails] = None
    running_balance: Optional[float] = None
    description: Optional[str] = None
    id: Optional[str] = None
    date: Optional[str] = None
    account_id: Optional[str] = None
    amount: Optional[float] = None
    type: Optional[str] = None
    status: Optional[str] = None