import logging
import os
from typing import Any, Dict
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from services.account_service import AccountService
from controllers.accounts_controller import create_accounts_controller
from services.certificate_service import CertificateService
from services.teller_service import TellerService
from repositories.secrets_repository import SecretsRepository
from utils.logger import get_logger

logger = get_logger(__name__)
app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://dc0ahfsbt39rt.cloudfront.net"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}")
    raise HTTPException(status_code=500, detail="An unexpected error occurred. Please try again later.")

aws_region = os.getenv('AWS_REGION', 'us-east-1')
secrets_repository = SecretsRepository(region_name=aws_region)
certificate_service = CertificateService(secrets_repository=secrets_repository)
teller_service = TellerService(certificate_service=certificate_service)
account_service = AccountService(teller_service=teller_service)

app.include_router(create_accounts_controller(account_service))

api_handler = Mangum(app)

def lambda_handler(event: Dict[str, Any], context: Any):
    """
    Entry point for Lambda. Handles both API Gateway and direct invocations.
    """
    logger.info("Received event: %s", event)

    if "httpMethod" in event:
        logger.info("Invoked by API Gateway")
        return api_handler(event, context)
    
    if event.get("source") == "aws.events":
        logger.info("Invoked by EventBridge rule (Scheduled event)")
        result = "HELLO"
        return {
            "statusCode": 200,
            "body": f"Task completed: {result}"
        }
    
    return {
        "statusCode": 400,
        "body": "Invalid invocation source."
    }