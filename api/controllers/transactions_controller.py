from fastapi import APIRouter, Depends, HTTPException
from services.transaction_service import TransactionService
from services.authentication_service import AuthenticationService
from schema.transaction_schema import TransactionGetResponse, TransactionEditRequest
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()
auth_service = AuthenticationService()

def create_transactions_controller(transaction_service: TransactionService) -> APIRouter:
    @router.get("/transactions")
    async def get_transactions(user_id: str = Depends(auth_service.extract_user_id)) -> TransactionGetResponse:
        try:
            if not user_id:
                logger.error("User ID is required but not provided.")
                raise HTTPException(status_code=400, detail="User ID is required")
            
            transactions = transaction_service.get_transactions(user_id)
            logger.info(f"Transactions retrieved for {user_id}: {transactions}")
            return {"transactions": transactions}
        except Exception as e:
            logger.error(f"Error retrieving transactions for user {user_id}: {e}")
            raise HTTPException(status_code=500, detail="Failed to retrieve transactions")
        
    @router.put("/transactions/{transaction_id}")
    async def edit_transaction(
        transaction_id: str,
        updated_fields: TransactionEditRequest,
        user_id: str = Depends(auth_service.extract_user_id)
    ):
        try:
            if not user_id:
                logger.error("User ID is required but not provided.")
                raise HTTPException(status_code=400, detail="User ID is required")
            
            success = transaction_service.edit_transaction(user_id, transaction_id, updated_fields.model_dump())
            
            if not success:
                raise HTTPException(status_code=404, detail="Transaction not found or failed to update")
            
            logger.info(f"Transaction {transaction_id} successfully updated for user: {user_id}")
            return {"message": "Transaction successfully updated"}
        except Exception as e:
            logger.error(f"Error editing transaction {transaction_id} for user {user_id}: {e}")
            raise HTTPException(status_code=500, detail="Failed to edit transaction")

    return router
