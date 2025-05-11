import { verifyToken, extractTokenFromHeader } from '../utils/jwt';

/**
 * Middleware to authenticate requests using JWT
 * @param req - The request object
 * @returns A Response object if authentication fails, undefined if successful
 */
export const authenticateJWT = (req: Request): Response | undefined => {
  // Get the authorization header
  const authHeader = req.headers.get('Authorization');
  
  // Extract the token
  const token = extractTokenFromHeader(authHeader || '');
  
  // If no token is provided, return 401 Unauthorized
  if (!token) {
    return new Response('Unauthorized: No token provided', { status: 401 });
  }
  
  // Verify the token
  const payload = verifyToken(token);
  
  // If token is invalid, return 401 Unauthorized
  if (!payload) {
    return new Response('Unauthorized: Invalid token', { status: 401 });
  }
  
  // Authentication successful, continue to the handler
  return undefined;
};

/**
 * Middleware to authenticate admin requests
 * @param req - The request object
 * @returns A Response object if authentication fails, undefined if successful
 */
export const authenticateAdmin = (req: Request): Response | undefined => {
  // Use the JWT authentication middleware
  const authResponse = authenticateJWT(req);
  
  // If authentication failed, return the error response
  if (authResponse) {
    return authResponse;
  }
  
  // Authentication successful, continue to the handler
  return undefined;
};