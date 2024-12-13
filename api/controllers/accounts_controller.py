import asyncio
from typing import Union
from fastapi import APIRouter, Depends, HTTPException, Body
from models.teller import CREDIT_SUBTYPES, DEPOSITORY_SUBTYPES, TellerAccount, TellerAccountBalance
from services.authentication_service import AuthenticationService
from schema.account_schema import AccountCreateRequest, AccountCreateResponse, AccountGetResponse
from services.teller_service import TellerService
from services.account_service import AccountService
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()
auth_service = AuthenticationService()

def create_accounts_controller(teller_service: TellerService, account_service: AccountService) -> APIRouter:
    @router.get("/accounts")
    async def get_accounts(user_id: str = Depends(auth_service.extract_user_id)) -> AccountGetResponse:
        try:
            # Step 1: Get all account links for the user
            account_links = account_service.get_account_links(user_id)

            # Step 2: Gather account details and balances concurrently
            account_data_tasks = []
            for account_link in account_links:
                # Fetch all accounts for the provider in parallel
                accounts_task = teller_service.get_accounts(account_link.ProviderID)  # Now it's a task, not a call
                account_data_tasks.append(accounts_task)

            # Now we await all accounts
            all_accounts = await asyncio.gather(*account_data_tasks)

            # Step 3: Gather balances concurrently for each account's provider
            balance_tasks = []
            for account_link, accounts in zip(account_links, all_accounts):
                balance_tasks.append([
                    teller_service.get_account_balance(account_link.ProviderID, account.id) for account in accounts
                ])

            # Await all balance fetching tasks concurrently
            all_balances = await asyncio.gather(*[asyncio.gather(*tasks) for tasks in balance_tasks])

            # Step 4: Combine accounts and balances
            accounts_with_balances = []
            for account_link, accounts, balances in zip(account_links, all_accounts, all_balances):
                for account, balance in zip(accounts, balances):
                    accounts_with_balances.append({"details": account, "balance": balance})

            # Step 5: Categorize accounts based on subtype
            categorized_accounts = {"debit": [], "credit": []}
            for account_data in accounts_with_balances:
                subtype = account_data["details"].subtype
                if subtype in DEPOSITORY_SUBTYPES:
                    categorized_accounts["debit"].append(account_data)
                elif subtype in CREDIT_SUBTYPES:
                    categorized_accounts["credit"].append(account_data)

            # Log and return categorized accounts
            logger.info(f"Categorized account links retrieved for {user_id}: {categorized_accounts}")
            return {"debit": categorized_accounts["debit"], "credit": categorized_accounts["credit"]}

        except Exception as e:
            logger.error(f"Error retrieving accounts for user {user_id}: {e}")
            raise HTTPException(status_code=500, detail="Failed to retrieve accounts")



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
