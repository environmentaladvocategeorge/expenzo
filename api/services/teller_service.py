import requests
from requests.auth import HTTPBasicAuth
from services.certificate_service import CertificateService
from typing import List
from models.teller import TellerAccount, TellerAccountBalance, TellerTransaction
from utils.logger import get_logger

logger = get_logger(__name__)

class TellerService:
    def __init__(self, certificate_service: CertificateService):
        self.certificate_service = certificate_service

    async def get_accounts(self, access_token: str) -> List[TellerAccount]:
        """
        Fetches from Teller the accounts for a given access token,

        Args:
            access_token (str): The access token from the account link

        Returns:
            List[TellerAccount]: A list of TellerAccount objects
        """
        cert_file_path, key_file_path = self.certificate_service.load_certificates()
        
        api_url = "https://api.teller.io/accounts"
        headers = {'Content-Type': 'application/json'}
        auth = HTTPBasicAuth(access_token, '')

        try:
            response = requests.get(api_url, headers=headers, auth=auth, cert=(cert_file_path, key_file_path))
            response.raise_for_status()
            logger.info("Response from Teller: %s", response.json())
            return[TellerAccount(**account) for account in response.json()]
        except requests.exceptions.RequestException as e:
            logger.error(f"Teller API request error: {e}")
            raise RuntimeError("Failed to call Teller API")
        
    async def get_account_balance(self, access_token: str, account_id: str) -> TellerAccountBalance:
        """
        Fetches the account balance from Teller for a given account ID using the provided access token.

        Args:
            access_token (str): The access token associated with the linked account.
            account_id (str): The unique identifier for the account whose balance is to be fetched.

        Returns:
            TellerAccountBalance: A TellerAccountBalance object containing the balance information.
        """
        cert_file_path, key_file_path = self.certificate_service.load_certificates()

        api_url = f"https://api.teller.io/accounts/{account_id}/balances"
        headers = {'Content-Type': 'application/json'}
        auth = HTTPBasicAuth(access_token, '')

        try:
            response = requests.get(api_url, headers=headers, auth=auth, cert=(cert_file_path, key_file_path))
            response.raise_for_status()
            data = response.json()

            if 'ledger' in data:
                data['ledger'] = float(data['ledger'])
            if 'available' in data:
                data['available'] = float(data['available'])
            
            logger.info("Response from Teller: %s", data)
            return TellerAccountBalance(**data)
        except requests.exceptions.RequestException as e:
            logger.error(f"Teller API request error: {e}")
            raise RuntimeError("Failed to call Teller API")
        
    async def get_account_transactions(self, access_token: str, account_id: str) -> List[TellerTransaction]:
        """
        Fetches the transactions for an account from Teller for a given account ID using the provided access token.

        Args:
            access_token (str): The access token associated with the linked account.
            account_id (str): The unique identifier for the account whose transactions is to be fetched.

        Returns:
            List[TellerTransaction]: A list of TellerTransaction objects.
        """
        cert_file_path, key_file_path = self.certificate_service.load_certificates()

        api_url = f"https://api.teller.io/accounts/{account_id}/transactions"
        headers = {'Content-Type': 'application/json'}
        auth = HTTPBasicAuth(access_token, '')

        try:
            response = requests.get(api_url, headers=headers, auth=auth, cert=(cert_file_path, key_file_path))
            response.raise_for_status()
            data = response.json()
            
            logger.info("Response from Teller: %s", data)
            return [TellerTransaction(**transaction) for transaction in response.json()]
        except requests.exceptions.RequestException as e:
            logger.error(f"Teller API request error: {e}")
            raise RuntimeError("Failed to call Teller API")

