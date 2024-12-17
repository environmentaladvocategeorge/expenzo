import boto3
from mypy_boto3_dynamodb.service_resource import DynamoDBServiceResource, _Table
import os

class DynamoDBClient:
    def __init__(self):
        self.dynamodb: DynamoDBServiceResource = boto3.resource('dynamodb', region_name=os.getenv('AWS_REGION'))
        self.table = self.dynamodb.Table(os.getenv('DYNAMO_DB_TABLE_NAME'))

    def get_table(self) -> _Table:
        return self.table

db_client = DynamoDBClient()
