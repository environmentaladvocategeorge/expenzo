from fastapi import APIRouter, HTTPException, Header
from services.teller_service import TellerService

router = APIRouter()

def create_accounts_controller(teller_service: TellerService) -> APIRouter:

    @router.get("/accounts")
    async def get_accounts(authorization: str = Header(..., description="Authorization header containing the Bearer token")):
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=400, detail="Invalid Authorization header")

        access_token = authorization.split("Bearer ")[1]
        if not access_token:
            raise HTTPException(status_code=400, detail="Invalid Bearer token")

        try:
            accounts = teller_service.get_accounts(access_token)
            return {"accounts": accounts}
        except RuntimeError as e:
            raise HTTPException(status_code=500, detail=str(e))

    return router
