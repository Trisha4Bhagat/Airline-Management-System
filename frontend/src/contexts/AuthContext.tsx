import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

interface UserProfile {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, username: string, password: string, fullName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = authService.isAuthenticated();
  
  // Setup axios interceptors
  useEffect(() => {
    // No need to call this explicitly, it's set up in the authService
  }, []);

  // Load user profile if authenticated
  useEffect(() => {
    const loadUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (error) {
          console.error('Failed to load user profile:', error);
          // Don't automatically logout on error to prevent redirect loops
          // Just clear the user state
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    loadUserProfile();
  }, [isAuthenticated]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      await authService.login({ username, password });
      const profile = await authService.getProfile();
      setUser(profile);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      await authService.register({
        email,
        username,
        password,
        full_name: fullName
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;