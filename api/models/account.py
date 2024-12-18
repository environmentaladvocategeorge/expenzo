from pydantic import BaseModel
from typing import Any, Optional, Dict

class Account(BaseModel):
    PK: str
    SK: str
    Provider: str
    ProviderID: str
    EntityType: str
    EntityID: str
    EntityData: Dict[str, Any]
    Timestamp: int
    Metadata: Optional[Dict[str, Any]] = {}

class Balance(BaseModel):
    PK: str
    SK: str
    Provider: str
    ProviderID: str
    EntityType: str
    EntityID: str
    EntityData: Dict[str, Any]
    Timestamp: int
    Metadata: Optional[Dict[str, Any]] = {}

class Transaction(BaseModel):
    PK: str
    SK: str
    Provider: str
    ProviderID: str
    EntityType: str
    EntityID: str
    EntityData: Dict[str, Any]
    Timestamp: int
    Metadata: Optional[Dict[str, Any]] = {}

class AccountLink(BaseModel):
    PK: str
    SK: str
    Provider: str
    ProviderID: str
    EntityType: str
    EntityData: Dict[str, Any]
    Timestamp: int
    Metadata: Optional[Dict[str, Any]] = {}

class AccountSync(BaseModel):
    PK: str
    SK: str
    Provider: str
    EntityType: str
    EntityData: Dict[str, Any]
    Timestamp: int