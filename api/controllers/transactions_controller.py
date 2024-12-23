from fastapi import APIRouter, Depends, HTTPException
from services.transaction_service import TransactionService
from services.authentication_service import AuthenticationService
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()
auth_service = AuthenticationService()

def create_transcations_controller(transaction_service: TransactionService) -> APIRouter:
    @router.get("/transactions")
    async def get_transactions(user_id: str = Depends(auth_service.extract_user_id)):
        try:
            if not user_id:
                logger.error("User ID is required but not provided.")
                raise HTTPException(status_code=400, detail="User ID is required")
            
            transactions = transaction_service.get_transactions(user_id)
            logger.info(f"Transactions retrieved for {user_id}: {transactions}")
            return transaction_service
        except Exception as e:
            logger.error(f"Error retrieving transactions for user {user_id}: {e}")
            raise HTTPException(status_code=500, detail="Failed to retrieve transactions")
        
    return router