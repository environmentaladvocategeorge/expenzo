import boto3
import json
import os
import logging
from botocore.exceptions import ClientError
import requests
from mangum import Mangum
from fastapi import FastAPI, HTTPException, Query
import tempfile

app = FastAPI()

AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
SECRET_NAME = os.getenv('SECRET_NAME', 'expenzo-dev-teller-certificates')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_secret(secret_name: str):
    """
    Retrieves certificate and private key from AWS Secrets Manager.

    Args:
        secret_name (str): The secret name in AWS Secrets Manager.

    Returns:
        tuple: (cert, private_key) strings containing the certificate and private key.

    Raises:
        HTTPException: If there is an error retrieving or parsing the secret.
    """
    try:
        client = boto3.client('secretsmanager', region_name=AWS_REGION)
        response = client.get_secret_value(SecretId=secret_name)
        secret = json.loads(response['SecretString'])
        cert = secret.get('cert')
        private_key = secret.get('privateKey')
        if not cert or not private_key:
            logger.error("Missing 'cert' or 'privateKey' in the secret.")
            raise HTTPException(status_code=500, detail="Missing required fields in the secret")
        return cert, private_key
    except ClientError as e:
        logger.error(f"Error retrieving secret from Secrets Manager: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving credentials from AWS Secrets Manager")
    except KeyError as e:
        logger.error(f"Secret parsing error: {e}")
        raise HTTPException(status_code=500, detail="Missing expected fields in secret")
    except Exception as e:
        logger.error(f"Unexpected error in get_secret: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred while retrieving secrets")

def generate_certificates(cert: str, private_key: str):
    """
    Generates temporary certificate and private key files.

    Args:
        cert (str): Certificate string.
        private_key (str): Private key string.

    Returns:
        tuple: Paths to the temporary certificate and private key files.

    Raises:
        HTTPException: If there is an error creating the temporary files.
    """
    try:
        with tempfile.NamedTemporaryFile(delete=False) as cert_file, tempfile.NamedTemporaryFile(delete=False) as key_file:
            cert_file.write(cert.encode('utf-8'))
            key_file.write(private_key.encode('utf-8'))
            return cert_file.name, key_file.name
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
        logger.info("Fetching secrets for TLS authentication.")
        cert, private_key = get_secret(SECRET_NAME)
        cert_file_path, key_file_path = generate_certificates(cert, private_key)

        api_url = "https://api.teller.io/accounts"
        headers = {
            'Authorization': f'Bearer {accessToken}',
            'Content-Type': 'application/json'
        }

        logger.info(f"Making request to Teller API at {api_url}")
        response = requests.get(api_url, headers=headers, cert=(cert_file_path, key_file_path))
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