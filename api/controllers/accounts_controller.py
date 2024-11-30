from fastapi import APIRouter, HTTPException, Query
from services.teller_service import TellerService

router = APIRouter()

def create_accounts_controller(teller_service: TellerService) -> APIRouter:

    @router.get("/accounts")
    async def get_accounts(
        access_token: str = Query(..., description="Access token as a query parameter")
    ):
        if not access_token:
            raise HTTPException(status_code=400, detail="Access token is required")

        try:
            accounts = teller_service.get_accounts(access_token)
            return {"accounts": accounts}
        except RuntimeError as e:
            raise HTTPException(status_code=500, detail=str(e))

    return router
