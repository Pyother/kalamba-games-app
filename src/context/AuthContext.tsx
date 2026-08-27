import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { getCurrentUser } from "api/users/getCurrentUser";
import { loginUser } from "api/users/loginUser";
import type { LoginUserType, UserType } from "types";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginUserType) => Promise<void>;
  logout: () => void;
  user: UserType | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const tokenStorageKey = "token";

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(tokenStorageKey);

    if (!token) {
      setIsLoading(false);
      return;
    }

    let isActive = true;

    getCurrentUser()
      .then(response => {
        if (isActive) {
          setUser(response.user);
        }
      })
      .catch(() => {
        localStorage.removeItem(tokenStorageKey);

        if (isActive) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginUserType): Promise<void> => {
    const response = await loginUser(credentials);

    localStorage.setItem(tokenStorageKey, response.user.token);
    setUser(response.user);
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem(tokenStorageKey);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
      user,
    }),
    [isLoading, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
