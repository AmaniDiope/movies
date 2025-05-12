
import React, { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "sonner";

interface User {
  username: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock admin credentials (in a real app this would be handled by a backend)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const login = (username: string, password: string) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const user = { username, role: "admin" as const };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Login successful");
      return true;
    }
    
    toast.error("Invalid credentials");
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
