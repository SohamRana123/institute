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
        // Only attempt to get current user if we're in a browser environment
        if (typeof window !== "undefined") {
          console.log("AuthContext - checking authentication status");
          
          // Debug cookies
          console.log("AuthContext - cookies:", document.cookie);
          
          // Get token from client-side cookie if available
          const getTokenFromCookie = () => {
            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(c => c.trim().startsWith('auth_token_client='));
            if (tokenCookie) {
              return tokenCookie.split('=')[1];
            }
            return null;
          };
          
          // Try to get the token from the client-side cookie
          const token = getTokenFromCookie();
          
          // If we have a token, add it to the Authorization header for the API call
          let headers = {};
          if (token) {
            console.log("AuthContext - Found token in client-side cookie, adding to Authorization header");
            headers.Authorization = `Bearer ${token}`;
          }
          
          const currentUser = await authAPI.getCurrentUser(headers);
          console.log("AuthContext - currentUser from server:", currentUser);

          if (currentUser && currentUser.id && currentUser.role) {
            setUser(currentUser);
            console.log("AuthContext - user state set to:", currentUser);
            
            // Store minimal auth info in localStorage for cross-tab sync
            localStorage.setItem('auth_user_id', currentUser.id);
            localStorage.setItem('auth_user_role', currentUser.role);
          } else {
            console.log("AuthContext - no valid current user found");
            setUser(null);
            
            // Clear localStorage auth info
            localStorage.removeItem('auth_user_id');
            localStorage.removeItem('auth_user_role');
          }
        }
      } catch (error) {
        console.error("AuthContext - error checking authentication:", error);
        setUser(null);
        
        // Clear localStorage auth info on error
        if (typeof window !== "undefined") {
          localStorage.removeItem('auth_user_id');
          localStorage.removeItem('auth_user_role');
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkAuth();
    
    // Add event listener for storage changes to sync auth state across tabs
    const handleStorageChange = (event) => {
      if (event.key === 'auth_state_change') {
        console.log('Auth state changed in another tab, refreshing state');
        // Force re-initialization
        setInitialized(false);
        // Immediately check auth again
        checkAuth();
      }
    };
    
    if (typeof window !== "undefined") {
      window.addEventListener('storage', handleStorageChange);
    }
    
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
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
        
        // Store minimal auth info in localStorage for cross-tab sync
        if (typeof window !== "undefined") {
          localStorage.setItem('auth_user_id', response.data.user.id);
          localStorage.setItem('auth_user_role', response.data.user.role);
          localStorage.setItem('auth_state_change', Date.now().toString());
        }
        
        // Debug cookies after login
        if (typeof document !== 'undefined') {
          console.log("Document cookies after login in AuthContext:", document.cookie);
        }
        
        // Wait a moment to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return success first, let the component handle redirection
        return { success: true, data: response.data, redirectTo: "/teacher-dashboard" };
      } else {
        console.error("Login error:", response.error);
        setUser(null);
        
        // Clear localStorage auth info
        if (typeof window !== "undefined") {
          localStorage.removeItem('auth_user_id');
          localStorage.removeItem('auth_user_role');
        }
        
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
      setInitialized(false); // Reset initialized state to force re-check on next mount
      
      // Clear localStorage auth info
      if (typeof window !== "undefined") {
        localStorage.removeItem('auth_user_id');
        localStorage.removeItem('auth_user_role');
        localStorage.setItem('auth_state_change', Date.now().toString());
        
        // Debug cookies after logout
        console.log("Document cookies after logout:", document.cookie);
        
        // Use hard navigation to ensure cookies are cleared properly
        window.location.href = "/teacher-login";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear user state even if logout fails
      setUser(null);
      setInitialized(false); // Reset initialized state to force re-check on next mount
      
      // Clear localStorage auth info even on error
      if (typeof window !== "undefined") {
        localStorage.removeItem('auth_user_id');
        localStorage.removeItem('auth_user_role');
        localStorage.setItem('auth_state_change', Date.now().toString());
        
        // Use hard navigation to ensure cookies are cleared properly
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
