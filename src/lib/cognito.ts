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
    newPasswordRequired: () => {
      const newPassword = prompt("Please enter a new password");
      cognitoUser.completeNewPasswordChallenge(
        newPassword || "",
        {},
        {
          onSuccess: (result: CognitoUserSession) => {
            callback(null, result);
          },
          onFailure: (err: Error) => {
            callback(err, null);
          },
        }
      );
    },
  });
};

export const logoutUser = () => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
};

export const reAuthenticateUser = (
  callback: (error: Error | null, result: CognitoUserSession | null) => void
) => {
  const cognitoUser = userPool.getCurrentUser();

  if (cognitoUser) {
    cognitoUser.getSession((err, session) => {
      if (err) {
        console.error("Failed to get session:", err);
        callback(err, null);
      } else {
        console.log("Session found:", session);

        // Check if the session is expired or about to expire
        if (session.isValid()) {
          console.log("Session is valid");
          callback(null, session);
        } else {
          // Refresh the session using the refresh token if the session is expired
          cognitoUser.refreshSession(
            session.getRefreshToken(),
            (err, newSession) => {
              if (err) {
                console.error("Failed to refresh session:", err);
                callback(err, null);
              } else {
                console.log("Session refreshed:", newSession);
                callback(null, newSession);
              }
            }
          );
        }
      }
    });
  } else {
    // If no user is found, return an error or null session
    callback(new Error("No current user found"), null);
  }
};
