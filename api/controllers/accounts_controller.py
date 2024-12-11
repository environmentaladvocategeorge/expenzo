from fastapi import APIRouter, Depends, HTTPException, Query, Body
from services.authentication_service import AuthenticationService
from schema.account_schema import AccountCreateRequest
from services.teller_service import TellerService
from services.account_service import AccountService

router = APIRouter()

auth_service = AuthenticationService()

def create_accounts_controller(teller_service: TellerService, account_service: AccountService) -> APIRouter:
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

    @router.post("/accounts")
    async def create_account(
        account_request: AccountCreateRequest = Body(..., description="Account creation data"),
        user_id: str = Depends(auth_service.extract_user_id)
    ):
        try:
            account = account_service.create_account_link(account_request, user_id)
            return {"account": account}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except RuntimeError as e:
            raise HTTPException(status_code=500, detail=str(e))

    return router
