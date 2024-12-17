import asyncio
import requests
from requests.auth import HTTPBasicAuth
from api.models.account import AccountLink
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
        except Exception as e:
            logger.error(f"Unexpected error when calling Teller: {e}")
            raise RuntimeError("An unexpected error occurred when calling Teller")
        
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
        except Exception as e:
            logger.error(f"Unexpected error when calling Teller: {e}")
            raise RuntimeError("An unexpected error occurred when calling Teller")
        
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
        except Exception as e:
            logger.error(f"Unexpected error when calling Teller: {e}")
            raise RuntimeError("An unexpected error occurred when calling Teller")
        
    async def fetch_all_accounts(self, account_links: list[AccountLink]) -> list[list[TellerAccount]]:
        """
        Fetch all accounts for a list of account links.

        Args:
            account_links (list[AccountLink]): The account links for which accounts need to be fetched.

        Returns:
            list[list[Account]]: A list of lists of Account objects.
        """
        logger.info("Fetching all accounts for %d account links", len(account_links))
        account_data_tasks = [
            self.get_accounts(account_link.ProviderID) for account_link in account_links
        ]
        return await asyncio.gather(*account_data_tasks)

    async def fetch_all_balances(self, account_links: list[AccountLink], all_accounts: list[list[TellerAccount]]) -> list[list[TellerAccountBalance]]:
        """
        Fetch all balances for a list of account links and their corresponding accounts.

        Args:
            account_links (list[AccountLink]): The account links for which balances need to be fetched.
            all_accounts (list[list[Account]]): The accounts corresponding to the account links.

        Returns:
            list[list[AccountBalance]]: A list of lists of AccountBalance objects.
        """
        logger.info("Fetching all balances for accounts")
        balance_tasks = [
            [
                self.get_account_balance(account_link.ProviderID, account.id) for account in accounts
            ]
            for account_link, accounts in zip(account_links, all_accounts)
        ]
        return await asyncio.gather(*[asyncio.gather(*tasks) for tasks in balance_tasks])
    
    async def _fetch_all_transactions(self, account_links: list[AccountLink], all_accounts: list[list[TellerAccount]]) -> list[list[TellerTransaction]]:
        """
        Fetch all transactions for a list of account links and their corresponding accounts.

        Args:
            account_links (list[AccountLink]): The account links for which balances need to be fetched.
            all_accounts (list[list[Account]]): The accounts corresponding to the account links.

        Returns:
            list[list[TellerTransaction]]: A list of lists of TellerTransaction objects.
        """
        logger.info("Fetching all transactions for accounts")
        transaction_tasks = [
            [
                self.get_account_transactions(account_link.ProviderID, account.id) for account in accounts
            ]
            for account_link, accounts in zip(account_links, all_accounts)
        ]
        return await asyncio.gather(*[asyncio.gather(*tasks) for tasks in transaction_tasks])
    

