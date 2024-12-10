from fastapi import APIRouter, HTTPException, Query, Body
from api.schema.account_schema import AccountCreateRequest
from services.teller_service import TellerService
from services.account_service import AccountService

router = APIRouter()

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
        account_request: AccountCreateRequest = Body(..., description="Account creation data")
    ):
        try:
            # Call the TellerService to create the account
            account = account_service.create_account(account_request)
            return {"message": "Account created successfully", "account": account}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except RuntimeError as e:
            raise HTTPException(status_code=500, detail=str(e))

    return router
