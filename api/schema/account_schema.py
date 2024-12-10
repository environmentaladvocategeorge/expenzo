from pydantic import BaseModel
from typing import Dict, Optional

class AccountSchema(BaseModel):
    Provider: str
    ProviderID: str
    EntityType: str
    EntityData: Dict[str, str]
    Metadata: Optional[Dict] = {}

class AccountCreateRequest(BaseModel):
    provider: str
    provider_id: str
    entity_type: str
    entity_data: Dict[str, str]
    metadata: Optional[Dict] = {}