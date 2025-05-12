import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * A component that protects routes by checking if the user is authenticated.
 * If not authenticated, it redirects to the login page.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [shouldRender, setShouldRender] = useState(false);

  // Use an effect to ensure we only render the children after authentication is confirmed
  useEffect(() => {
    if (isAuthenticated && !loading) {
      // Add a small delay to ensure the authentication state is fully propagated
      const timeoutId = setTimeout(() => {
        setShouldRender(true);
      }, 50);

      return () => clearTimeout(timeoutId);
    } else {
      setShouldRender(false);
    }
  }, [isAuthenticated, loading]);

  // Show loading state while checking authentication
  if (loading || (isAuthenticated && !shouldRender)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F1E9]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A6151] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#3E3C3B] font-['Lato']">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="login" state={{ from: location }} replace />;
  }

  // If authenticated and should render, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
