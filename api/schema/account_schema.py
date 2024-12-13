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

class AccountGetResponse(BaseModel):
    debit: list[dict[str, Union[list[dict[str, Union[TellerAccount, TellerAccountBalance]]], float]]]
    credit: list[dict[str, Union[list[dict[str, Union[TellerAccount, TellerAccountBalance]]], float]]]
