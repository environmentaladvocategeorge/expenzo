from typing import Optional
from pydantic import BaseModel

class TellerInstitution(BaseModel):
    name: str
    id: str

class TellerAccountBalance(BaseModel):
    ledger: float
    account_id: str
    available: float

DEPOSITORY_SUBTYPES = {
    "checking", "savings", "money_market", "certificate_of_deposit", "treasury", "sweep"
}

CREDIT_SUBTYPES = {"credit_card"}

class TellerAccount(BaseModel):
    enrollment_id: str
    institution: TellerInstitution
    type: str
    name: str
    subtype: str
    currency: str
    id: str
    last_four: str
    status: str

class TellerTransactionDetails(BaseModel):
    processing_status: str
    category: Optional[str]

class TellerTransaction(BaseModel):
    details: TellerTransactionDetails
    running_balance: Optional[float]
    description: str
    id: str
    date: str
    account_id: str
    amount: float
    type: str
    status: str