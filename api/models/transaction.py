from pydantic import BaseModel
from typing import Any, Optional, Dict

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