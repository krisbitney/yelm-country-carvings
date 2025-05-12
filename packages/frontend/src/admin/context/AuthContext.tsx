import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the authentication state interface
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Define the authentication context interface
interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize the authentication state
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    loading: true,
    error: null,
  });

  // Check if the user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setAuthState({
          isAuthenticated: false,
          token: null,
          loading: false,
          error: null,
        });
        return;
      }

      try {
        // Verify the token with the backend
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setAuthState({
            isAuthenticated: true,
            token,
            loading: false,
            error: null,
          });
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('adminToken');
          setAuthState({
            isAuthenticated: false,
            token: null,
            loading: false,
            error: 'Session expired. Please log in again.',
          });
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setAuthState({
          isAuthenticated: false,
          token: null,
          loading: false,
          error: 'Authentication error. Please try again.',
        });
      }
    };

    void checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store the token in localStorage
        localStorage.setItem('adminToken', data.token);

        // Update the auth state immediately
        // Use a callback to ensure we're working with the latest state
        setAuthState({
          isAuthenticated: true,
          token: data.token,
          loading: false,
          error: null,
        });

        // Add a longer delay to ensure the state is updated before navigation
        await new Promise(resolve => setTimeout(resolve, 300));

        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: data.message || 'Invalid credentials',
        }));

        return false;
      }
    } catch (error) {
      console.error('Login error:', error);

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Login failed. Please try again.',
      }));

      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('adminToken');

    // Update the authentication state
    setAuthState({
      isAuthenticated: false,
      token: null,
      loading: false,
      error: null,
    });
  };

  // Clear error function
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  // Create the context value
  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    clearError,
  };

  // Provide the context to children
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
