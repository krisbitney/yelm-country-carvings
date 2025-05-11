import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook for making authenticated API calls to the admin endpoints
 */
export const useAdminAuth = () => {
  const { token } = useAuth();

  /**
   * Make an authenticated fetch request to the API
   * @param url - The URL to fetch
   * @param options - The fetch options
   * @returns The fetch response
   */
  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Prepare headers
      const newHeaders = new Headers(options.headers);
      newHeaders.set('Authorization', `Bearer ${token}`);
      if (!(options.body instanceof FormData)) {
        newHeaders.set('Content-Type', 'application/json');
      }

      // Add the authorization header to the request
      const authOptions: RequestInit = {
        ...options,
        headers: newHeaders,
      };

      // Make the request
      const response = await fetch(url, authOptions);

      // Handle unauthorized responses
      if (response.status === 401) {
        throw new Error('Unauthorized: Your session may have expired');
      }

      return response;
    },
    [token]
  );

  return { authFetch };
};