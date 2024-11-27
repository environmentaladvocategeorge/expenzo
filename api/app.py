import boto3
import json
import requests
from flask import Flask, jsonify, request
from botocore.exceptions import ClientError

app = Flask(__name__)

def get_secret(secret_name):
    """ Retrieve certificate and private key from AWS Secrets Manager """
    region_name = "us-east-1"
    client = boto3.client('secretsmanager', region_name=region_name)
    
    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        print(f"Error retrieving secret: {e}")
        return None, None
    
    secret = get_secret_value_response['SecretString']
    cert_info = json.loads(secret)
    
    return cert_info.get('certificate'), cert_info.get('private_key')

@app.route('/accounts', methods=['GET'])
def get_accounts():
    access_token = request.args.get('accessToken')
    if not access_token:
        return jsonify({"error": "Missing accessToken parameter"}), 400

    cert, private_key = get_secret('earth-watcher-dev-teller-secrets')

    if not cert or not private_key:
        return jsonify({"error": "Failed to retrieve certificate or private key"}), 500

    api_url = "https://api.teller.io/accounts"

    headers = {
        'Authorization': f'Bearer {access_token}',
    }

    try:
        response = requests.get(api_url, headers=headers, cert=(cert, private_key))
        response.raise_for_status()
        data = response.json()

        return jsonify(data)

    except requests.exceptions.RequestException as e:
        print(f"API call error: {e}")
        return jsonify({"error": "Failed to call Teller API"}), 500

if __name__ == "__main__":
    app.run(debug=True)
