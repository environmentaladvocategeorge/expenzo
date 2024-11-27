import boto3
import json
import os
import logging
from botocore.exceptions import ClientError
import requests
from flask import Flask, jsonify, request
from werkzeug.exceptions import HTTPException

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
SECRET_NAME = os.getenv('SECRET_NAME', 'earth-watcher-dev-teller-secrets')

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

@app.route('/accounts', methods=['GET'])
def get_accounts():
    """
    Fetches account info from Teller API using the provided access token.

    access_token (str): The access token from query params.
    Returns: Tuple: JSON response with account data or error.
    """
    access_token = request.args.get('accessToken')
    
    if not access_token:
        return jsonify({"error": "Missing accessToken parameter"}), 400

    try:
        cert, private_key = get_secret(SECRET_NAME)

        if not cert or not private_key:
            logger.error("Failed to retrieve certificate or private key from secrets.")
            return jsonify({"error": "Failed to retrieve certificate or private key"}), 500

        api_url = "https://api.teller.io/accounts"
        headers = {'Authorization': f'Bearer {access_token}'}
        
        response = requests.get(api_url, headers=headers, cert=(cert, private_key))
        response.raise_for_status() 
        data = response.json()
        
        return jsonify(data)
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Error making request to Teller API: {e}")
        return jsonify({"error": "Failed to call Teller API"}), 500

@app.errorhandler(HTTPException)
def handle_exception(e):
    """
    Global error handler for HTTPException.

    e (HTTPException): The exception object.
    Returns: Tuple: JSON-formatted error message.
    """
    response = e.get_response()
    response.data = json.dumps({
        "error": str(e),
        "message": e.description
    })
    response.content_type = "application/json"
    return response

if __name__ == "__main__":
    app.run(debug=True)
