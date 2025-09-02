import { useState, useEffect } from 'react';
import { AuthContext } from '../hooks/useAuth';

interface User {
  id: string;
  email: string;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // In a real app, you'd validate the token with your backend
        setIsAuthenticated(true);
        setUser({ id: '1', email: 'admin@social.samaraie' });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple mock authentication
    // In production, this would call your authentication API
    if (email === 'admin@social.samaraie' && password === 'admin123') {
      setIsAuthenticated(true);
      setUser({ id: '1', email });
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
