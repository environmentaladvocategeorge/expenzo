from pydantic import BaseModel

class TellerInstitution(BaseModel):
    name: str
    id: str

class TellerAccountBalance(BaseModel):
    ledger: str
    account_id: str
    available: str

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
