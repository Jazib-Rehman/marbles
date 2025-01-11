"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

interface AuthContextProps {
  user: any | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = jwt.decode(token);
      if (decodedUser) {
        setUser(decodedUser);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token"); // Cleanup invalid token
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decodedUser = jwt.decode(token);
    if (
      decodedUser &&
      typeof decodedUser === "object" &&
      "role" in decodedUser
    ) {
      setUser(decodedUser);
      setIsAuthenticated(true);

      if (decodedUser.role === "admin") router.push("/admin-dashboard");
      else if (decodedUser.role === "agency") router.push("/agency-dashboard");
      else if (decodedUser.role === "team") router.push("/team-dashboard");
    } else {
      console.error("Invalid token structure");
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
