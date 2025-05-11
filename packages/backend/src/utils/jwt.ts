import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

// Define the payload type
interface JWTPayload {
  username: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token
 * @param payload - The data to include in the token
 * @param expiresIn - Token expiration time (default: 24 hours)
 * @returns The generated JWT token
 */
export const generateToken = (payload: JWTPayload, expiresIn = '24h'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token
 * @param token - The token to verify
 * @returns The decoded payload if valid, null otherwise
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('JWT verification error:', error);
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