import boto3
import os

class DynamoDBClient:
    def __init__(self):
        self.dynamodb = boto3.resource(
            'dynamodb',
            region_name=os.getenv('AWS_REGION'),
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
            aws_secret_access_key=os.getenv('AWS_SECRET_KEY'),
        )
        self.table = self.dynamodb.Table(os.getenv('DYNAMODB_TABLE'))

    def get_table(self):
        return self.table

db_client = DynamoDBClient()
