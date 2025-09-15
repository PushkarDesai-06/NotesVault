import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { api } from "../lib/axios";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // You might want to verify the token here
      // For now, we'll just extract user info from token or make an API call
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        setUser({ username: payload.username });
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const { token } = response.data;
      setToken(token);
      setUser({ username });
      localStorage.setItem("token", token);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      await api.post("/auth/register", {
        username,
        password,
      });

      // After successful registration, automatically log in
      return await login(username, password);
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
