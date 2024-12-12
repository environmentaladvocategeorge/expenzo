import logging

def get_logger(name: str = __name__):
    logger = logging.getLogger(name)
    if not logger.hasHandlers():
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(filename)s - %(lineno)d - %(levelname)s - %(message)s"
        )
    logger.setLevel(logging.INFO)
    return logger
