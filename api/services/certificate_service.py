import os
import logging

logger = logging.getLogger(__name__)

class CertificateService:
    def __init__(self, secrets_repository):
        self.secrets_repository = secrets_repository
        self.cert_file_path = None
        self.key_file_path = None

    def generate_certificates(self, cert: str, private_key: str) -> tuple:
        try:
            cert_file_path = '/tmp/cert.pem'
            key_file_path = '/tmp/key.pem'

            with open(cert_file_path, 'w') as cert_file:
                cert_file.write(cert)

            with open(key_file_path, 'w') as key_file:
                key_file.write(private_key)

            return cert_file_path, key_file_path
        except Exception as e:
            logger.error(f"Error generating certificate files: {e}")
            raise RuntimeError("Failed to generate certificate files")

    def load_certificates(self, cert_name: str, pk_name: str) -> tuple:
        if self.cert_file_path and self.key_file_path:
            logger.info("Using cached certificates")
            return self.cert_file_path, self.key_file_path

        cert = self.secrets_repository.get_secret(cert_name)
        private_key = self.secrets_repository.get_secret(pk_name)

        self.cert_file_path, self.key_file_path = self.generate_certificates(cert, private_key)
        return self.cert_file_path, self.key_file_path
