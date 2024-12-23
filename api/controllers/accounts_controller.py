import asyncio
from typing import Union
from fastapi import APIRouter, Depends, HTTPException, Body
from models.teller import CREDIT_SUBTYPES, DEPOSITORY_SUBTYPES, TellerAccount, TellerAccountBalance
from services.authentication_service import AuthenticationService
from schema.account_schema import AccountCreateRequest, AccountCreateResponse, AccountGetResponse
from services.account_service import AccountService
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()
auth_service = AuthenticationService()

def create_accounts_controller(account_service: AccountService) -> APIRouter:
    @router.get("/accounts")
    async def get_accounts(user_id: str = Depends(auth_service.extract_user_id)) -> AccountGetResponse:
        try:
            if not user_id:
                logger.error("User ID is required but not provided.")
                raise HTTPException(status_code=400, detail="User ID is required")
            
            categorized_accounts = await account_service.get_categorized_accounts(user_id)
            logger.info(f"Categorized account links retrieved for {user_id}: {categorized_accounts}")
            return categorized_accounts
        except Exception as e:
            logger.error(f"Error retrieving accounts for user {user_id}: {e}")
            raise HTTPException(status_code=500, detail="Failed to retrieve accounts")
    
    @router.post("/accounts")
    async def create_account(
        account_request: AccountCreateRequest = Body(..., description="Account creation data"),
        user_id: str = Depends(auth_service.extract_user_id)
    ) -> AccountCreateResponse:
        try:
            if not user_id:
                logger.error("User ID is required but not provided.")
                raise HTTPException(status_code=400, detail="User ID is required")
            
            account = account_service.create_account_link(account_request, user_id)
            logger.info(f"Account link created successfully for user {user_id}: {account}")
            return {"account": account}
        except Exception as e:
            logger.exception(f"Unexpected error occurred while creating account for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    return router
