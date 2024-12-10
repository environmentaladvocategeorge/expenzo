import boto3
import os

class DynamoDBClient:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb', region_name=os.getenv('AWS_REGION'))
        self.table = self.dynamodb.Table(os.getenv('DYNAMO_DB_TABLE_NAME'))

    def get_table(self):
        return self.table

db_client = DynamoDBClient()
