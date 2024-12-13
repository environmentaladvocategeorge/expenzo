import asyncio
from typing import Union
from fastapi import APIRouter, Depends, HTTPException, Body
from models.teller import CREDIT_SUBTYPES, DEPOSITORY_SUBTYPES
from services.authentication_service import AuthenticationService
from schema.account_schema import AccountCreateRequest, AccountCreateResponse, AccountGetResponse
from services.teller_service import TellerService
from services.account_service import AccountService
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()
auth_service = AuthenticationService()

def parse_float(value: str) -> float:
    try:
        return float(value)
    except ValueError:
        logger.warning(f"Failed to parse value: {value}")
        return 0.0

def create_accounts_controller(teller_service: TellerService, account_service: AccountService) -> APIRouter:
    @router.get("/accounts")
    async def get_accounts(user_id: str = Depends(auth_service.extract_user_id)) -> AccountGetResponse:
        try:
            account_links = account_service.get_account_links(user_id)

            # Fetch account data for each account link
            account_data_tasks = []
            for account_link in account_links:
                accounts_task = teller_service.get_accounts(account_link.ProviderID)
                account_data_tasks.append(accounts_task)

            all_accounts = await asyncio.gather(*account_data_tasks)

            # Fetch balances for each account
            balance_tasks = []
            for account_link, accounts in zip(account_links, all_accounts):
                balance_tasks.append([
                    teller_service.get_account_balance(account_link.ProviderID, account.id) for account in accounts
                ])

            all_balances = await asyncio.gather(*[asyncio.gather(*tasks) for tasks in balance_tasks])

            # Combine account data and balances
            accounts_with_balances = []
            for account_link, accounts, balances in zip(account_links, all_accounts, all_balances):
                for account, balance in zip(accounts, balances):
                    accounts_with_balances.append({"details": account, "balance": balance})

            # Initialize categorized accounts and totals
            categorized_accounts = {"debit": [], "credit": []}

            total_debit_ledger = 0
            total_debit_available = 0
            total_credit_ledger = 0
            total_credit_available = 0

            # Categorize accounts and add ledger/available
            for account_data in accounts_with_balances:
                subtype = account_data["details"].subtype
                ledger_str = account_data["balance"].ledger
                available_str = account_data["balance"].available

                # Parse ledger and available from strings to floats
                ledger = parse_float(ledger_str)
                available = parse_float(available_str)

                # Create the account response structure
                account_info = {
                    "details": account_data["details"],  # TellerAccount
                    "balance": account_data["balance"],  # TellerAccountBalance
                    "ledger": ledger,  # Parsed ledger value
                    "available": available  # Parsed available value
                }

                # Add to debit or credit category and update totals
                if subtype in DEPOSITORY_SUBTYPES:
                    categorized_accounts["debit"].append(account_info)
                    total_debit_ledger += ledger
                    total_debit_available += available
                elif subtype in CREDIT_SUBTYPES:
                    categorized_accounts["credit"].append(account_info)
                    total_credit_ledger += ledger
                    total_credit_available += available

            # Calculate net worth: debit (positive) - credit (negative)
            net_worth = total_debit_ledger - total_credit_ledger

            # Log results
            logger.info(f"Categorized account links retrieved for {user_id}: {categorized_accounts}")
            logger.info(f"Net worth calculated for {user_id}: {net_worth}")

            # Return the response including categorized accounts and net worth
            return AccountGetResponse(
                net_worth=net_worth,
                debit=categorized_accounts["debit"],
                credit=categorized_accounts["credit"]
            )

        except Exception as e:
            logger.error(f"Error retrieving accounts for {user_id}: {e}")
            raise HTTPException(status_code=500, detail="Error retrieving accounts")
        
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
