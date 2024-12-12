from pydantic import BaseModel
from typing import Optional, Union
from models.teller import Account, AccountBalance
from models.account import AccountLink

class AccountCreateRequest(BaseModel):
    provider: str
    provider_id: str
    entity_data: dict[str, str]
    metadata: Optional[dict] = {}

class AccountCreateResponse(BaseModel):
    account: AccountLink

class AccountGetResponse(BaseModel):
    accounts: list[dict[str, Union[Account, AccountBalance]]]
