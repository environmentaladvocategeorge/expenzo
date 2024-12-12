import asyncio
import logging
from fastapi import APIRouter, Depends, HTTPException, Body
from services.authentication_service import AuthenticationService
from schema.account_schema import AccountCreateRequest, AccountCreateResponse, AccountGetResponse
from services.teller_service import TellerService
from services.account_service import AccountService

router = APIRouter()

auth_service = AuthenticationService()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(filename)s - %(lineno)d - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

def create_accounts_controller(teller_service: TellerService, account_service: AccountService) -> APIRouter:
    @router.get("/accounts")
    async def get_accounts(user_id: str = Depends(auth_service.extract_user_id)) -> AccountGetResponse:
        try:
            account_links = account_service.get_account_links(user_id)
            tasks = [
                asyncio.gather(
                    *[
                        teller_service.get_account_balance(account_link.ProviderID, account.id)
                        for account in await teller_service.get_accounts(account_link.ProviderID)
                    ]
                )
                for account_link in account_links
            ]
            accounts_with_balances = [
                {"account": account, "balance": balance}
                for account_link, account_balances in zip(account_links, await asyncio.gather(*tasks))
                for account, balance in zip(await teller_service.get_accounts(account_link.ProviderID), account_balances)
            ]
            logger.info(f"Account links retrieved from Teller for {user_id}: {accounts_with_balances}")
            return {"accounts": accounts_with_balances}
        except Exception as e:
            logger.exception(f"Error occurred while fetching accounts for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    @router.post("/accounts")
    async def create_account(
        account_request: AccountCreateRequest = Body(..., description="Account creation data"),
        user_id: str = Depends(auth_service.extract_user_id)
    ) -> AccountCreateResponse:
        try:
            account = account_service.create_account_link(account_request, user_id)
            logger.info(f"Account link created successfully for user {user_id}: {account}")
            return {"account": account}
        except Exception as e:
            logger.exception(f"Unexpected error occurred while creating account for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    return router
