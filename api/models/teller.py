from pydantic import BaseModel
from typing import Optional


class Institution(BaseModel):
    name: str
    id: str

class Links(BaseModel):
    account: Optional[str] = None 
    self: str
    balances: Optional[str] = None
    transactions: Optional[str] = None

class AccountBalance(BaseModel):
    ledger: str
    account_id: str
    available: str
    links: Links

class Account(BaseModel):
    enrollment_id: str
    links: Links
    institution: Institution
    type: str
    name: str
    subtype: str
    currency: str
    id: str
    last_four: str
    status: str
