import requests
from requests.auth import HTTPBasicAuth
from services.certificate_service import CertificateService
import logging

logger = logging.getLogger(__name__)

class TellerService:
    def __init__(self, certificate_service: CertificateService):
        self.certificate_service = certificate_service

    async def get_accounts(self, access_token: str) -> dict[str, any]:
        """
        Fetches from Teller the accounts for a given access token,

        Args:
            access_token (str): The access token from the account link

        Returns:
            response (dict[str, any]): An array of Teller account objects
        """
        cert_file_path, key_file_path = self.certificate_service.load_certificates()
        
        api_url = "https://api.teller.io/accounts"
        headers = {'Content-Type': 'application/json'}
        auth = HTTPBasicAuth(access_token, '')

        try:
            response = requests.get(api_url, headers=headers, auth=auth, cert=(cert_file_path, key_file_path))
            response.raise_for_status()
            logger.info("Response from Teller: %s", response.json())
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Teller API request error: {e}")
            raise RuntimeError("Failed to call Teller API")
