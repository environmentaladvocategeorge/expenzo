import asyncio
import logging
from fastapi import APIRouter, Depends, HTTPException, Body
from services.authentication_service import AuthenticationService
from schema.account_schema import AccountCreateRequest
from services.teller_service import TellerService
from services.account_service import AccountService

router = APIRouter()

auth_service = AuthenticationService()

logger = logging.getLogger(__name__)

def create_accounts_controller(teller_service: TellerService, account_service: AccountService) -> APIRouter:
    @router.get("/accounts")
    async def get_accounts(user_id: str = Depends(auth_service.extract_user_id)):
        try:
            account_links = account_service.get_account_links(user_id)
            accounts = await asyncio.gather(
                *[teller_service.get_accounts(account_link.ProviderID) for account_link in account_links]
            )
            logger.info(f"Account lins retrieved from teller for {user_id}: {accounts}")
            return {"accounts": [account for sublist in accounts for account in sublist]}
        except RuntimeError as e:
            logger.error(f"Runtime error occurred while fetching accounts for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")
        except Exception as e:
            logger.exception(f"Unexpected error occurred while fetching accounts for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    @router.post("/accounts")
    async def create_account(
        account_request: AccountCreateRequest = Body(..., description="Account creation data"),
        user_id: str = Depends(auth_service.extract_user_id)
    ):
        try:
            account = account_service.create_account_link(account_request, user_id)
            logger.info(f"Account link created successfully for user {user_id}: {account}")
            return {"account": account}
        except ValueError as e:
            logger.error(f"Validation error while creating account for user {user_id}: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))
        except RuntimeError as e:
            logger.error(f"Runtime error occurred while creating account for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")
        except Exception as e:
            logger.exception(f"Unexpected error occurred while creating account for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    return router
