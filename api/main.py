import logging
import os
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
    "http://localhost:3000"
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
account_service = AccountService()

app.include_router(create_accounts_controller(teller_service, account_service))

handler = Mangum(app)
