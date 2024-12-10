from pydantic import BaseModel
from typing import Dict, Optional

class AccountCreateRequest(BaseModel):
    provider: str
    provider_id: str
    entity_data: Dict[str, str]
    metadata: Optional[Dict] = {}