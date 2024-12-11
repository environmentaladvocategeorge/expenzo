import os
from fastapi import Request, HTTPException
from jose import jwt, JWTError
import requests

class AuthenticationService:
    def __init__(self):
        self.COGNITO_USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
        self.COGNITO_APP_CLIENT_ID = os.getenv("COGNITO_APP_CLIENT_ID")
        self.COGNITO_REGION = os.getenv("AWS_REGION", "us-east-1") 

        self.COGNITO_PUBLIC_KEYS_URL = f"https://cognito-idp.{self.COGNITO_REGION}.amazonaws.com/{self.COGNITO_USER_POOL_ID}/.well-known/jwks.json"

    def get_cognito_public_keys(self):
        """
        Fetches Cognito public keys used to validate JWT tokens.
        """
        try:
            response = requests.get(self.COGNITO_PUBLIC_KEYS_URL)
            response.raise_for_status()
            return response.json()['keys']
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=500, detail=f"Error fetching Cognito public keys: {str(e)}")

    def decode_and_verify_token(self, token: str):
        """
        Decodes and verifies the JWT token using the public keys from Cognito.
        """
        try:
            unverified_header = jwt.get_unverified_header(token)
            if unverified_header is None or 'kid' not in unverified_header:
                raise HTTPException(status_code=401, detail="Unable to find token kid.")

            public_keys = self.get_cognito_public_keys()

            rsa_key = {}
            for key in public_keys:
                if key['kid'] == unverified_header['kid']:
                    rsa_key = {
                        'kty': key['kty'],
                        'kid': key['kid'],
                        'use': key['use'],
                        'n': key['n'],
                        'e': key['e']
                    }
                    break

            if not rsa_key:
                raise HTTPException(status_code=401, detail="Unable to find appropriate public key.")

            # Decode and verify the JWT using the public key
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=self.COGNITO_APP_CLIENT_ID,
                issuer=f"https://cognito-idp.{self.COGNITO_REGION}.amazonaws.com/{self.COGNITO_USER_POOL_ID}"
            )
            return payload
        except JWTError as e:
            raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error decoding token: {str(e)}")

    async def extract_user_id(self, request: Request):
        """
        Extracts the Cognito user ID from the JWT token provided in the request header.
        """
        auth_header = request.headers.get("Authorization")
        if auth_header is None:
            raise HTTPException(status_code=400, detail="Authorization header missing")

        token = auth_header.split(" ")[1]

        payload = self.decode_and_verify_token(token)

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID not found in token")

        return user_id
