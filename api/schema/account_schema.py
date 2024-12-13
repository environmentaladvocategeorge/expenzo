from pydantic import BaseModel
from typing import Optional, Union
from models.teller import TellerAccount, TellerAccountBalance
from models.account import AccountLink

class AccountCreateRequest(BaseModel):
    provider: str
    provider_id: str
    entity_data: dict[str, str]
    metadata: Optional[dict] = {}

class AccountCreateResponse(BaseModel):
    account: AccountLink

class CategorizedAccounts:
    accounts: list[dict[str, Union[TellerAccount, TellerAccountBalance]]]
    total_ledger: float
    total_available: float

class AccountGetResponse(BaseModel):
    debit: CategorizedAccounts
    credit: CategorizedAccounts