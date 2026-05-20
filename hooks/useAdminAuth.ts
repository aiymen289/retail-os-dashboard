import { useState, useCallback } from "react";

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "retail123",
};

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if admin is logged in (client-side only)
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_auth") === "true";
    }
    return false;
  });

  const login = useCallback((username: string, password: string) => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
