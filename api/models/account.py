from pydantic import BaseModel
from typing import Optional, Dict

class Account(BaseModel):
    PK: str
    SK: str
    Provider: str
    ProviderID: str
    EntityType: str
    EntityData: Dict[str, str]
    Timestamp: int
    Metadata: Optional[Dict] = {}

class AccountLink(BaseModel):
    PK: str
    SK: str
    Provider: str
    ProviderID: str
    EntityType: str
    EntityData: Dict[str, str]
    Timestamp: int
    Metadata: Optional[Dict] = {}