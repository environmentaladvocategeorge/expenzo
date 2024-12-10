from pydantic import BaseModel
from typing import Dict, Optional

class AccountSchema(BaseModel):
    Provider: str
    ProviderID: str
    EntityType: str
    EntityData: Dict[str, str]
    Metadata: Optional[Dict] = {}