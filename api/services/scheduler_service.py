from datetime import datetime, timezone
from services.account_service import AccountService
from services.teller_service import TellerService
from models.account import Account, Balance
from models.teller import TellerTransaction
from models.transaction import Transaction
from db.dynamodb_client import db_client
from schema.account_schema import CategorizedAccounts
from boto3.dynamodb.conditions import Attr
from utils.logger import get_logger

logger = get_logger(__name__)

class SchedulerService:
    def __init__(self, account_service: AccountService, teller_service: TellerService):
        self.account_service = account_service
        self.teller_service = teller_service
        self.table = db_client.get_table()

    async def consolidate_account_balances(self):
        """
        Fetch accounts and categorize them into debit and credit groups.

        Args:
            user_id (str): The user ID whose accounts need to be fetched and categorized.

        Returns:
            dict[str, CategorizedAccounts]: Categorized accounts with 'debit' and 'credit' keys.
        """
        account_links = self.account_service.get_account_links()

        if not account_links:
            logger.info("No account links found")
            return {"debit": CategorizedAccounts(), "credit": CategorizedAccounts()}
        
        logger.info("Found %s account links in the database", len(account_links))
 
        all_accounts = await self.teller_service.fetch_all_accounts_for_links(account_links)
        all_balances = await self.teller_service.fetch_balances_for_accounts(account_links, all_accounts)

        accounts_with_balances = self.account_service.combine_accounts_and_balances(all_accounts, all_balances)

        logger.info("Found %s accounts and their balances from Teller.", len(accounts_with_balances))

        account_links_dict = {link.EntityData['enrollment_id']: link for link in account_links}

        for account in accounts_with_balances:
            enrollment_id = account.get('details').enrollment_id
            account_link = account_links_dict.get(enrollment_id)

            account_to_insert = Account(
                PK=account_link.PK,
                SK=f"Provider#{account_link.Provider}#Account#{account_link.ProviderID}#EntityID#{account.get('details').id}",
                Provider=account_link.Provider,
                ProviderID=account_link.ProviderID,
                EntityType="Account",
                EntityID=account.get('details').id,
                EntityData=account.get('details').model_dump(),
                Timestamp=int(datetime.now(tz=timezone.utc).timestamp()),
            )

            balance_data = account.get('balance').model_dump()
            balance_data['ledger'] = str(balance_data.get('ledger'))
            balance_data['available'] = str(balance_data.get('available'))

            balance_to_insert = Balance(
                PK=account_link.PK,
                SK=f"Provider#{account_link.Provider}#Balance#{account_link.ProviderID}#EntityID#{account.get('balance').account_id}",
                Provider=account_link.Provider,
                ProviderID=account_link.ProviderID,
                EntityType="Balance",
                EntityID=account.get('balance').account_id,
                EntityData=balance_data,
                Timestamp=int(datetime.now(tz=timezone.utc).timestamp()),
            )
            
            account_item = account_to_insert.model_dump()
            balance_item = balance_to_insert.model_dump()

            try:
                self.table.put_item(
                    Item=account_item,
                    ConditionExpression=Attr('PK').not_exists() & Attr('SK').not_exists(),
                )
                logger.info(f"Inserted new account item with PK {account_item['PK']} and SK {account_item['SK']}")
                await self.sync_transactions_for_account(account_to_insert)
                logger.info(f"Finished syncing transactions for {account_item['EntityId']}")
            except Exception as e:
                logger.warning(f"Account item with PK {account_item['PK']} and SK {account_item['SK']} already exists. Skipping insert.")

            try:
                self.table.update_item(
                    Key={
                        'PK': balance_to_insert.PK,
                        'SK': balance_to_insert.SK
                    },
                    UpdateExpression="SET #entity_data = :entity_data, #timestamp = :timestamp, "
                                    "#provider = :provider, #provider_id = :provider_id, "
                                    "#entity_type = :entity_type, #entity_id = :entity_id",
                    ExpressionAttributeNames={
                        '#entity_data': 'EntityData',
                        '#timestamp': 'Timestamp',
                        '#provider': 'Provider',
                        '#provider_id': 'ProviderID',
                        '#entity_type': 'EntityType',
                        '#entity_id': 'EntityID'
                    },
                    ExpressionAttributeValues={
                        ':entity_data': balance_to_insert.EntityData,
                        ':timestamp': balance_to_insert.Timestamp,
                        ':provider': balance_to_insert.Provider,
                        ':provider_id': balance_to_insert.ProviderID,
                        ':entity_type': balance_to_insert.EntityType,
                        ':entity_id': balance_to_insert.EntityID
                    }
                )
                logger.info(f"Upserted balance item with PK {balance_item['PK']} and SK {balance_item['SK']}")
            except Exception as e:
                logger.error(f"Failed to upsert balance item with PK {balance_item['PK']} and SK {balance_item['SK']}: {str(e)}")
        
        return accounts_with_balances
    
    async def consolidate_transactions(self):
        """
        Fetch all accounts from the database and synchronize transactions for each account.

        This method scans the table for items where `EntityType` is 'Account', and for each
        account found, it calls `sync_transactions_for_account` to process the transactions.

        Returns:
            None
        """
        response = self.table.scan(
            FilterExpression=Attr('EntityType').eq('Account')
        )

        items = response.get('Items', [])

        accounts = [Account(**item) for item in items]

        for account in accounts:
            await self.sync_transactions_for_account(account)

    async def sync_transactions_for_account(self, account: Account):
        """
        Sync transactions for a given account and update the database.

        Args:
            account (Account): The account object containing details needed for transaction synchronization.

        Returns:
            None
        """
        try:
            transactions: list[TellerTransaction] = await self.teller_service.fetch_account_transactions(
                account.ProviderID, account.EntityID
            )

            for transaction in transactions:
                transaction_data = transaction.model_dump()
                transaction_data['running_balance'] = (
                    str(transaction_data['running_balance']) 
                    if transaction_data.get('running_balance') is not None 
                    else None
                )
                transaction_data['amount'] = str(transaction_data.get('amount'))

                sk = f"Provider#{account.Provider}#Transaction#{account.ProviderID}#EntityID#{transaction_data['id']}"
                transaction_to_insert = Transaction(
                    PK=account.PK,
                    SK=sk,
                    Provider=account.Provider,
                    ProviderID=account.ProviderID,
                    EntityType="Transaction",
                    EntityID=transaction_data.get('id'),
                    EntityData=transaction_data,
                    Timestamp=int(datetime.now(tz=timezone.utc).timestamp()),
                )

                existing_transaction = self.table.get_item(
                    Key={"PK": account.PK, "SK": sk}
                ).get("Item")

                if existing_transaction:
                    existing_entity_data = existing_transaction.get("EntityData", {})
                    update_expressions = []
                    expression_attribute_names = {}
                    expression_attribute_values = {}

                    if existing_entity_data.get("amount") != transaction_data["amount"]:
                        update_expressions.append("EntityData.amount = :amount")
                        expression_attribute_values[":amount"] = transaction_data["amount"]

                    if existing_entity_data.get("details", {}).get("processing_status") != transaction_data["details"]["processing_status"]:
                        update_expressions.append("EntityData.#attr_details.#attr_processing_status = :details_processing_status")
                        expression_attribute_names["#attr_details"] = "details"
                        expression_attribute_names["#attr_processing_status"] = "processing_status"
                        expression_attribute_values[":details_processing_status"] = transaction_data["details"]["processing_status"]

                    if existing_entity_data.get("status") != transaction_data["status"]:
                        update_expressions.append("EntityData.#attr_status = :status")
                        expression_attribute_names["#attr_status"] = "status"
                        expression_attribute_values[":status"] = transaction_data["status"]

                    if existing_entity_data.get("date") != transaction_data["date"]:
                        update_expressions.append("EntityData.#attr_date = :date")
                        expression_attribute_names["#attr_date"] = "date"
                        expression_attribute_values[":date"] = transaction_data["date"]

                    if update_expressions:
                        update_expressions.append("EntityData.#ts = :timestamp")
                        expression_attribute_names["#ts"] = "Timestamp"
                        expression_attribute_values[":timestamp"] = int(datetime.now(tz=timezone.utc).timestamp())

                        update_expression = f"SET {', '.join(update_expressions)}"
                        self.table.update_item(
                            Key={"PK": account.PK, "SK": sk},
                            UpdateExpression=update_expression,
                            ExpressionAttributeNames=expression_attribute_names or None,
                            ExpressionAttributeValues=expression_attribute_values or None,
                        )
                        logger.info(f"Updated transaction object with PK {account.PK} and SK {sk}")
                    else:
                        logger.info(f"No changes detected for transaction with PK {account.PK} and SK {sk}")
                else:
                    self.table.put_item(Item=transaction_to_insert.model_dump())
                    logger.info(f"Inserted new transaction object with PK {transaction_to_insert.PK} and SK {transaction_to_insert.SK}")

        except Exception as e:
            logger.error(f"An error occurred while syncing transactions for account {account.PK}: {e}")