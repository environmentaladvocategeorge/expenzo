#!/bin/bash

set -e

ASSUMED_ROLE_ARN=$1
ACCOUNT_ID=$2
ENVIRONMENT=$3
STACK_NAME="earth-watcher-dashboard-${ENVIRONMENT}"
REGION="us-east-1"

STACK_STATUS=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].StackStatus" --output text || echo "NOT_FOUND")

if [[ "$STACK_STATUS" == "ROLLBACK_COMPLETE" ]]; then
  echo "Stack is in ROLLBACK_COMPLETE state. Deleting the stack..."
  aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION
  echo "Waiting for stack deletion to complete..."
  aws cloudformation wait stack-delete-complete --stack-name $STACK_NAME --region $REGION
elif [[ "$STACK_STATUS" != "NOT_FOUND" ]]; then
  echo "Stack is in status: $STACK_STATUS. Proceeding with deployment."
else
  echo "Stack not found. Proceeding with deployment."
fi

echo "Deploying SAM application..."
sam deploy \
  --template-file packaged.yaml \
  --stack-name $STACK_NAME \
  --parameter-overrides Environment=${ENVIRONMENT} DeploymentRoleARN=${ASSUMED_ROLE_ARN} \
  --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
  --region $REGION

echo "Syncing build files to S3 bucket: s3://${STACK_NAME}/..."
aws s3 sync out s3://${STACK_NAME}/ --delete

echo "Deployment complete."
