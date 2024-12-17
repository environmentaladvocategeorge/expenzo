import asyncio
import os
from services.account_service import AccountService
from services.certificate_service import CertificateService
from services.teller_service import TellerService
from services.scheduler_service import SchedulerService
from repositories.secrets_repository import SecretsRepository
from utils.logger import get_logger

logger = get_logger(__name__)

aws_region = os.getenv('AWS_REGION', 'us-east-1')
secrets_repository = SecretsRepository(region_name=aws_region)
certificate_service = CertificateService(secrets_repository=secrets_repository)
teller_service = TellerService(certificate_service=certificate_service)
account_service = AccountService(teller_service=teller_service)
scheduler_service = SchedulerService(account_service=account_service, teller_service=teller_service)

def handler(event, context):
    """
    This function will be triggered by AWS EventBridge.
    """
    try:
        logger.info(f"Event received: {event}")
        task = event.get("task")
        
        if task == "consolidate_account_balances":
            logger.info("Starting task: consolidate_account_balances")
            result = asyncio.run(scheduler_service.consolidate_account_balances())
            logger.info(f"Task completed successfully: {result}")
        else:
            error_message = f"Unknown task received: {task}"
            logger.error(error_message)
            raise ValueError(error_message)
    except Exception as e:
        logger.error(f"Error processing event: {e}")
        raise e