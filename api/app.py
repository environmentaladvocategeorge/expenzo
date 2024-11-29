import boto3
import os
import logging
from botocore.exceptions import ClientError
import requests
from requests.auth import HTTPBasicAuth
from mangum import Mangum
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
CERT_SECRET_NAME = os.getenv('CERT_SECRET_NAME', 'expenzo-dev-teller-cert')
PK_SECRET_NAME = os.getenv('PK_SECRET_NAME', 'expenzo-dev-teller-pk')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

cached_cert_file_path = None
cached_key_file_path = None

def get_secret(secret_name: str) -> str:
    """
    Retrieves a plaintext secret from AWS Secrets Manager.
    """
    try:
        client = boto3.client('secretsmanager', region_name=AWS_REGION)
        response = client.get_secret_value(SecretId=secret_name)
        secret = response['SecretString']
        if not secret:
            raise HTTPException(status_code=500, detail=f"Secret {secret_name} is empty")
        return secret
    except ClientError as e:
        logger.error(f"Error retrieving secret {secret_name}: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving credentials from AWS Secrets Manager")
    except Exception as e:
        logger.error(f"Unexpected error retrieving {secret_name}: {e}")
        raise HTTPException(status_code=500, detail="Unexpected error retrieving secrets")

def generate_certificates(cert: str, private_key: str) -> tuple:
    """
    Writes certificate and private key files to /tmp for reuse.
    """
    try:
        cert_file_path = '/tmp/cert.pem'
        key_file_path = '/tmp/key.pem'

        with open(cert_file_path, 'w') as cert_file:
            cert_file.write(cert)

        with open(key_file_path, 'w') as key_file:
            key_file.write(private_key)

        return cert_file_path, key_file_path

    except Exception as e:
        logger.error(f"Error writing certificate files: {e}")
        raise HTTPException(status_code=500, detail="Failed to write certificate files")

def load_certificates():
    """
    Caches certificates in global variables if not already cached.
    """
    global cached_cert_file_path, cached_key_file_path

    if cached_cert_file_path and cached_key_file_path:
        logger.info("Using cached certificates")
        return cached_cert_file_path, cached_key_file_path

    cert = get_secret(CERT_SECRET_NAME)
    private_key = get_secret(PK_SECRET_NAME)

    cached_cert_file_path, cached_key_file_path = generate_certificates(cert, private_key)
    return cached_cert_file_path, cached_key_file_path

@app.get("/accounts")
async def get_accounts(
    authorization: str = Header(..., description="Authorization header containing the Bearer token")
):
    """
    Fetches account info from Teller API using the provided Bearer token.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid Authorization header")

    accessToken = authorization.split("Bearer ")[1]

    if not accessToken:
        raise HTTPException(status_code=400, detail="Invalid Bearer token")

    try:
        cert_file_path, key_file_path = load_certificates()

        api_url = "https://api.teller.io/accounts"
        headers = {'Content-Type': 'application/json'}
        auth = HTTPBasicAuth(accessToken, '')

        response = requests.get(api_url, headers=headers, auth=auth, cert=(cert_file_path, key_file_path))
        response.raise_for_status()
        return {"accounts": response.json()}

    except requests.exceptions.RequestException as e:
        logger.error(f"Teller API request error: {e}")
        raise HTTPException(status_code=500, detail="Failed to call Teller API")
    except Exception as e:
        logger.error(f"Unexpected error fetching accounts: {e}")
        raise HTTPException(status_code=500, detail="Unexpected error occurred")

handler = Mangum(app)