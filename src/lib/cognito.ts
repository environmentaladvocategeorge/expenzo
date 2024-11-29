import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
};

export const userPool = new CognitoUserPool(poolData);

export const authenticateUser = (
  username: string,
  password: string,
  callback: (error: Error | null, result: CognitoUserSession | null) => void
) => {
  const userData = {
    Username: username,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);

  const authenticationData = {
    Username: username,
    Password: password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result: CognitoUserSession) => {
      callback(null, result);
    },
    onFailure: (err: Error) => {
      callback(err, null);
    },
  });
};
