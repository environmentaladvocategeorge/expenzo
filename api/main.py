import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from controllers.accounts_controller import create_accounts_controller
from services.certificate_service import CertificateService
from services.teller_service import TellerService
from repositories.secrets_repository import SecretsRepository

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

aws_region = os.getenv('AWS_REGION', 'us-east-1')
secrets_repository = SecretsRepository(region_name=aws_region)
certificate_service = CertificateService(secrets_repository=secrets_repository)
teller_service = TellerService(certificate_service=certificate_service)

app.include_router(create_accounts_controller(teller_service))

handler = Mangum(app)
