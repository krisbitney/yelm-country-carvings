import jwt, {Secret} from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use test-specific secret in test mode, otherwise use the environment variable
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'test-secret';

// Define the payload type
interface JWTPayload {
  username: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token
 * @param payload - The data to include in the token
 * @returns The generated JWT token
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET);
};

/**
 * Verify a JWT token
 * @param token - The token to verify
 * @returns The decoded payload if valid, null otherwise
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
};

/**
 * Extract token from Authorization header
 * @param authHeader - The Authorization header value
 * @returns The token if present and valid format, null otherwise
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1];
};
