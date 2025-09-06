import { useState, useEffect } from 'react';
import { AuthContext } from '../hooks/useAuth';
import { supabaseAuthService, type AuthUser } from '../services/supabaseAuthService';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await supabaseAuthService.getCurrentUser();
        if (currentUser) {
          setIsAuthenticated(true);
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await supabaseAuthService.login({ email, password });
      
      if (response.success && response.user) {
        setIsAuthenticated(true);
        setUser(response.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabaseAuthService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await supabaseAuthService.requestPasswordReset(email);
      return response;
    } catch (error) {
      console.error('Password reset request failed:', error);
      return { success: false, error: 'Password reset request failed' };
    }
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
    user,
    requestPasswordReset,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
