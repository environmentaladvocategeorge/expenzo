import boto3
import json
import os
import logging
from botocore.exceptions import ClientError
import requests
from mangum import Mangum
from werkzeug.exceptions import HTTPException

AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
SECRET_NAME = os.getenv('SECRET_NAME', 'earth-watcher-dev-teller-secrets')

# Initialize logger
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
        cert = secret.get('certificate')
        private_key = secret.get('private_key')
        return cert, private_key
    except ClientError as e:
        logger.error(f"Error retrieving secret: {e}")
        raise HTTPException(description="Error retrieving credentials from AWS Secrets Manager", response=500)
    except KeyError as e:
        logger.error(f"Secret parsing error: {e}")
        raise HTTPException(description="Missing expected fields in secret", response=500)

def get_accounts(event, context):
    """
    Fetches account info from Teller API using the provided access token.

    event (dict): The event passed by API Gateway.
    context (LambdaContext): The context object provided by AWS Lambda.
    Returns: dict: JSON response with account data or error.
    """
    access_token = event.get('queryStringParameters', {}).get('accessToken')
    
    if not access_token:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing accessToken parameter"})
        }

    try:
        cert, private_key = get_secret(SECRET_NAME)

        if not cert or not private_key:
            logger.error("Failed to retrieve certificate or private key from secrets.")
            return {
                "statusCode": 500,
                "body": json.dumps({"error": "Failed to retrieve certificate or private key"})
            }

        api_url = "https://api.teller.io/accounts"
        headers = {'Authorization': f'Bearer {access_token}'}
        
        response = requests.get(api_url, headers=headers, cert=(cert, private_key))
        response.raise_for_status() 
        data = response.json()
        
        return {
            "statusCode": 200,
            "body": json.dumps(data)
        }
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Error making request to Teller API: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Failed to call Teller API"})
        }

handler = Mangum(app=None) 

def lambda_handler(event, context):
    if event['httpMethod'] == 'GET' and event['resource'] == '/accounts':
        return get_accounts(event, context)
    else:
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "Not Found"})
        }
