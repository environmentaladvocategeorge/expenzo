import boto3
import json
import os
import logging
from botocore.exceptions import ClientError
import requests
from requests.auth import HTTPBasicAuth
from mangum import Mangum
from fastapi import FastAPI, HTTPException, Query

app = FastAPI()

AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
CERT_SECRET_NAME = os.getenv('CERT_SECRET_NAME', 'expenzo-dev-teller-cert')
PK_SECRET_NAME = os.getenv('PK_SECRET_NAME', 'expenzo-dev-teller-pk')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_secret(secret_name: str):
    """
    Retrieves a plaintext secret from AWS Secrets Manager.

    Args:
        secret_name (str): The secret name in AWS Secrets Manager.

    Returns:
        str: The secret string.

    Raises:
        HTTPException: If there is an error retrieving or parsing the secret.
    """
    try:
        client = boto3.client('secretsmanager', region_name=AWS_REGION)
        response = client.get_secret_value(SecretId=secret_name)
        secret = response['SecretString']
        if not secret:
            logger.error(f"Secret {secret_name} is empty.")
            raise HTTPException(status_code=500, detail=f"Secret {secret_name} is empty")
        return secret
    except ClientError as e:
        logger.error(f"Error retrieving secret {secret_name} from Secrets Manager: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving credentials from AWS Secrets Manager")
    except Exception as e:
        logger.error(f"Unexpected error in get_secret: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred while retrieving secrets")

def generate_certificates(cert: str, private_key: str):
    """
    Generates temporary certificate and private key files in the /tmp directory for AWS Lambda.

    Args:
        cert (str): Certificate string.
        private_key (str): Private key string.

    Returns:
        tuple: Paths to the temporary certificate and private key files.

    Raises:
        HTTPException: If there is an error creating the temporary files.
    """
    try:
        # Create certificate and private key files in /tmp directory
        cert_file_path = '/tmp/cert.pem'
        key_file_path = '/tmp/key.pem'

        with open(cert_file_path, 'w') as cert_file:
            cert_file.write(cert)

        with open(key_file_path, 'w') as key_file:
            key_file.write(private_key)

        return cert_file_path, key_file_path

    except Exception as e:
        logger.error(f"Error generating certificate files: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate certificate files")

@app.get("/accounts")
async def get_accounts(
    accessToken: str = Query(..., description="The access token for authentication")
):
    """
    Fetches account info from Teller API using the provided access token.

    Args:
        accessToken (str): The access token passed as a query parameter.

    Returns:
        JSON: Response data from Teller API.

    Raises:
        HTTPException: For invalid access token, API errors, or other issues.
    """
    if not accessToken:
        logger.error("Missing accessToken parameter.")
        raise HTTPException(status_code=400, detail="Missing accessToken parameter")

    try:
        logger.info("Fetching certificate and private key from AWS Secrets Manager.")
        
        # Retrieve certificate and private key as separate secrets
        cert = get_secret(CERT_SECRET_NAME)
        private_key = get_secret(PK_SECRET_NAME)
        
        cert_file_path, key_file_path = generate_certificates(cert, private_key)

        api_url = "https://api.teller.io/accounts"
        headers = {
            'Content-Type': 'application/json'
        }

        auth = HTTPBasicAuth(accessToken, '')

        logger.info(f"Making request to Teller API at {api_url}")
        response = requests.get(api_url, headers=headers, auth=auth, cert=(cert_file_path, key_file_path))
        logger.info(f"Teller API response status code: {response.status_code}")

        response.raise_for_status()
        logger.info("Teller API request successful.")
        return response.json()

    except requests.exceptions.RequestException as e:
        logger.error(f"Error making request to Teller API: {e}")
        logger.debug(f"Request headers: {headers}")
        raise HTTPException(status_code=500, detail="Failed to call Teller API")
    except Exception as e:
        logger.error(f"Unexpected error in get_accounts: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred while fetching account data")
    finally:
        # Cleanup temporary files
        for file_path in [locals().get('cert_file_path'), locals().get('key_file_path')]:
            if file_path and os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Temporary file {file_path} removed.")

handler = Mangum(app)
