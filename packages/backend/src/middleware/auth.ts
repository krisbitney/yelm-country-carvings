import { verifyToken, extractTokenFromHeader } from '../utils/jwt';
import { createErrorResponse } from '../utils/headers';

/**
 * Middleware to authenticate requests using JWT
 * @param req - The request object
 * @returns A Response object if authentication fails, undefined if successful
 */
export const authenticateJWT = async (req: Request): Promise<Response | undefined> => {
  const authHeader = req.headers.get('Authorization');

  const token = extractTokenFromHeader(authHeader || '');
  if (!token) {
    return await createErrorResponse('Unauthorized: No token provided', 401);
  }

  const payload = verifyToken(token);
  if (!payload) {
    return await createErrorResponse('Unauthorized: Invalid token', 401);
  }

  return undefined;
};
