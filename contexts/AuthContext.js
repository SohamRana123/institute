"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/lib/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    // Skip if already initialized
    if (initialized) return;

    const checkAuth = async () => {
      try {
        const currentUser = await authAPI.getCurrentUser();
        console.log("AuthContext - currentUser from server:", currentUser);

        if (currentUser && currentUser.id && currentUser.role) {
          setUser(currentUser);
          console.log("AuthContext - user state set to:", currentUser);
        } else {
          console.log("AuthContext - no valid current user found");
          setUser(null);
        }
      } catch (error) {
        console.error("AuthContext - error checking authentication:", error);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkAuth();
  }, [initialized]);

  // Login function for teachers/admins
  const login = async (credentials) => {
    setLoading(true);
    try {
      console.log("Login attempt with credentials:", credentials.email);
      const response = await authAPI.login(credentials);
      console.log("Login response:", response);

      if (response.success && response.data?.user) {
        console.log("Setting user state after login:", response.data.user);
        setUser(response.data.user);
        setInitialized(true);
        
        // Redirect to teacher dashboard after successful login
        if (typeof window !== "undefined" && (response.data.user.role === "TEACHER" || response.data.user.role === "ADMIN")) {
          console.log("Redirecting to teacher dashboard");
          window.location.href = "/teacher-dashboard";
        }
        
        return { success: true, data: response.data };
      } else {
        console.error("Login error:", response.error);
        setUser(null);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
      return { success: false, error: error.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  // Student login function
  const studentLogin = async (studentId) => {
    try {
      const response = await authAPI.studentLogin(studentId);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/teacher-login";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear user state even if logout fails
      setUser(null);
      if (typeof window !== "undefined") {
        window.location.href = "/teacher-login";
      }
    }
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === "string") {
      if (roles === "TEACHER") {
        return user.role === "TEACHER" || user.role === "ADMIN";
      }
      return user.role === roles;
    }
    return (
      roles.includes(user.role) ||
      (roles.includes("TEACHER") &&
        (user.role === "TEACHER" || user.role === "ADMIN"))
    );
  };

  const value = {
    user,
    loading,
    initialized,
    login,
    studentLogin,
    register,
    logout,
    isAuthenticated: !!user,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
