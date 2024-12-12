from pydantic import BaseModel

class Institution(BaseModel):
    name: str
    id: str

class AccountBalance(BaseModel):
    ledger: str
    account_id: str
    available: str

class Account(BaseModel):
    enrollment_id: str
    institution: Institution
    type: str
    name: str
    subtype: str
    currency: str
    id: str
    last_four: str
    status: str
