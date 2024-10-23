import json
import boto3
import os

# Initialize the Kinesis client
kinesis_client = boto3.client('kinesis')

def lambda_handler(event, context):
    # Retrieve the Kinesis stream name from environment variables
    kinesis_stream_name = os.environ.get('KINESIS_STREAM_NAME')
    
    # Prepare test data to send
    test_data = {
        'message': 'Test data from Lambda function',
        'timestamp': context.aws_request_id
    }
    
    # Send data to the Kinesis stream
    response = kinesis_client.put_record(
        StreamName=kinesis_stream_name,
        Data=json.dumps(test_data),
        PartitionKey=context.aws_request_id
    )
    
    # Log the response
    print(f"Successfully put record to Kinesis: {response}")
    
    return {
        'statusCode': 200,
        'body': json.dumps('Data sent to Kinesis successfully!')
    }
