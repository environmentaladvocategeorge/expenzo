import requests
from requests.auth import HTTPBasicAuth
from services.certificate_service import CertificateService
import logging
from typing import List
from models.teller import Account, AccountBalance

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(filename)s - %(lineno)d - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class TellerService:
    def __init__(self, certificate_service: CertificateService):
        self.certificate_service = certificate_service

    async def get_accounts(self, access_token: str) -> List[Account]:
        """
        Fetches from Teller the accounts for a given access token,

        Args:
            access_token (str): The access token from the account link

        Returns:
            List[Account]: A list of Teller account objects
        """
        cert_file_path, key_file_path = self.certificate_service.load_certificates()
        
        api_url = "https://api.teller.io/accounts"
        headers = {'Content-Type': 'application/json'}
        auth = HTTPBasicAuth(access_token, '')

        try:
            response = requests.get(api_url, headers=headers, auth=auth, cert=(cert_file_path, key_file_path))
            response.raise_for_status()
            logger.info("Response from Teller: %s", response.json())
            return[Account(**account) for account in response.json()]
        except requests.exceptions.RequestException as e:
            logger.error(f"Teller API request error: {e}")
            raise RuntimeError("Failed to call Teller API")
        
    async def get_account_balance(self, access_token: str, account_id: str) -> AccountBalance:
        """
        Fetches the account balance from Teller for a given account ID using the provided access token.

        Args:
            access_token (str): The access token associated with the linked account.
            account_id (str): The unique identifier for the account whose balance is to be fetched.

        Returns:
            AccountBalance: An AccountBalance object containing the balance information.
        """
        cert_file_path, key_file_path = self.certificate_service.load_certificates()
        
        api_url = f"https://api.teller.io/accounts/{account_id}/balances"
        headers = {'Content-Type': 'application/json'}
        auth = HTTPBasicAuth(access_token, '')

        try:
            response = requests.get(api_url, headers=headers, auth=auth, cert=(cert_file_path, key_file_path))
            response.raise_for_status()
            logger.info("Response from Teller: %s", response.json())
            return AccountBalance(**response.json())
        except requests.exceptions.RequestException as e:
            logger.error(f"Teller API request error: {e}")
            raise RuntimeError("Failed to call Teller API")
