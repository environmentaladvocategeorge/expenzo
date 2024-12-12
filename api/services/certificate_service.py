import logging
import os
from repositories.secrets_repository import SecretsRepository

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(filename)s - %(lineno)d - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

class CertificateService:
    def __init__(self, secrets_repository: SecretsRepository):
        self.secrets_repository: SecretsRepository = secrets_repository
        self.cert_file_path: str | None = None
        self.key_file_path: str | None = None

    def generate_certificates(self, cert: str, private_key: str) -> tuple[str, str]:
        """
        Generates certificate and private key files in the temporary directory.

        Args:
            cert (str): The certificate content.
            private_key (str): The private key content.

        Returns:
            tuple[str, str]: Paths to the generated certificate and private key files.
        """
        try:
            cert_file_path: str = '/tmp/cert.pem'
            key_file_path: str = '/tmp/key.pem'

            with open(cert_file_path, 'w') as cert_file:
                cert_file.write(cert)

            with open(key_file_path, 'w') as key_file:
                key_file.write(private_key)

            return cert_file_path, key_file_path
        except Exception as e:
            logger.error(f"Error generating certificate files: {e}")
            raise RuntimeError("Failed to generate certificate files")

    def load_certificates(self) -> tuple[str, str]:
        """
        Loads certificate and private key files, fetching them from secrets if not cached.

        Returns:
            tuple[str, str]: Paths to the certificate and private key files.
        """
        cert_name: str | None = os.getenv('CERT_SECRET_NAME')
        pk_name: str | None = os.getenv('PK_SECRET_NAME')

        if self.cert_file_path and self.key_file_path:
            logger.info("Using cached certificates")
            return self.cert_file_path, self.key_file_path

        if not cert_name or not pk_name:
            logger.error("Certificate or private key secret name is missing from environment variables")
            raise RuntimeError("Missing certificate or private key secret names")

        cert: str = self.secrets_repository.get_secret(cert_name)
        private_key: str = self.secrets_repository.get_secret(pk_name)

        self.cert_file_path, self.key_file_path = self.generate_certificates(cert, private_key)
        return self.cert_file_path, self.key_file_path
