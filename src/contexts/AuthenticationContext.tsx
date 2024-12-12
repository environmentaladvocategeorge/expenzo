import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  authenticateUser,
  logoutUser,
  reAuthenticateUser,
} from "@/lib/cognito";
import { CognitoUserSession } from "amazon-cognito-identity-js";

interface AuthContextType {
  user: CognitoUserSession | null;
  getToken: () => string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  showLoginModal: boolean;
  setShowLoginModal: (value: boolean) => void;
  isLoggingIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CognitoUserSession | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    reAuthenticateUser((err, session) => {
      if (err) {
        setIsAuthenticated(false);
        setShowLoginModal(true);
      } else {
        setUser(session);
        setShowLoginModal(false);
        setIsAuthenticated(true);
      }
    });
  }, []);

  const getToken = (): string | null => {
    try {
      return user?.getIdToken().getJwtToken() || null;
    } catch (error) {
      console.error("Failed to get access token:", error);
      return null;
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    setIsLoggingIn(true);

    return new Promise<void>((resolve, reject) => {
      authenticateUser(
        username,
        password,
        (err: Error | null, result: CognitoUserSession | null) => {
          if (err) {
            console.error("Login failed", err);
            setIsLoggingIn(false);
            reject(err);
          } else {
            console.log("Login success", result);
            setUser(result);
            setIsAuthenticated(true);
            setShowLoginModal(false);
            setIsLoggingIn(false);
            resolve();
          }
        }
      );
    });
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    setShowLoginModal(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        getToken,
        login,
        logout,
        isAuthenticated,
        showLoginModal,
        setShowLoginModal,
        isLoggingIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
