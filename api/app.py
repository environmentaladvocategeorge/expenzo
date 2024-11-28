import boto3
import json
import os
import logging
from botocore.exceptions import ClientError
import requests
from mangum import Mangum
from fastapi import FastAPI, HTTPException, Query

app = FastAPI()

AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
SECRET_NAME = os.getenv('SECRET_NAME', 'expenzo-dev-teller-secrets')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_secret(secret_name):
    """
    Retrieves certificate and private key from AWS Secrets Manager.

    secret_name (str): The secret name in AWS Secrets Manager.
    Returns: (str, str): Certificate and private key or None.
    """
    try:
        client = boto3.client('secretsmanager', region_name=AWS_REGION)
        response = client.get_secret_value(SecretId=secret_name)
        secret = json.loads(response['SecretString'])
        cert = secret.get('cert')
        private_key = secret.get('privateKey')
        return cert, private_key
    except ClientError as e:
        logger.error(f"Error retrieving secret: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving credentials from AWS Secrets Manager")
    except KeyError as e:
        logger.error(f"Secret parsing error: {e}")
        raise HTTPException(status_code=500, detail="Missing expected fields in secret")

@app.get("/accounts")
async def get_accounts(
    accessToken: str = Query(..., description="The access token for authentication")
):
    """
    Fetches account info from Teller API using the provided access token.

    accessToken (str): The access token passed as a query parameter.
    Returns: JSON response with account data or error.
    """
    if not accessToken:
        raise HTTPException(status_code=400, detail="Missing accessToken parameter")

    try:
        cert, private_key = get_secret(SECRET_NAME)

        if not cert or not private_key:
            logger.error("Failed to retrieve certificate or private key from secrets.")
            raise HTTPException(status_code=500, detail="Failed to retrieve certificate or private key")

        api_url = "https://api.teller.io/accounts"
        headers = {'Authorization': f'Bearer {accessToken}'}
        
        response = requests.get(api_url, headers=headers, cert=(cert, private_key))
        response.raise_for_status() 
        data = response.json()
        
        return data
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Error making request to Teller API: {e}")
        raise HTTPException(status_code=500, detail="Failed to call Teller API")

# This is the correct invocation of Mangum
handler = Mangum(app)