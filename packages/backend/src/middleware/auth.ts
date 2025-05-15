import { verifyToken, extractTokenFromHeader } from '../utils/jwt';

/**
 * Middleware to authenticate requests using JWT
 * @param req - The request object
 * @returns A Response object if authentication fails, undefined if successful
 */
export const authenticateJWT = (req: Request): Response | undefined => {
  const authHeader = req.headers.get('Authorization');

  const token = extractTokenFromHeader(authHeader || '');
  if (!token) {
    return new Response('Unauthorized: No token provided', { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return new Response('Unauthorized: Invalid token', { status: 401 });
  }

  return undefined;
};
