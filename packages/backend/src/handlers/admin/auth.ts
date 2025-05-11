import dotenv from 'dotenv';
import { generateToken } from '../../utils/jwt';

// Load environment variables
dotenv.config();

// Get admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'secure_password';

/**
 * Handle admin login
 * @param req - The request object
 * @returns A Response object with the result of the login attempt
 */
export const handleAdminLogin = async (req: Request): Promise<Response> => {
  try {
    // Parse the request body
    const { username, password } = await req.json();
    
    // Validate the credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate a JWT token
      const token = generateToken({ username });
      
      // Return the token
      return Response.json({ 
        success: true, 
        token,
        message: 'Login successful' 
      });
    }
    
    // Invalid credentials
    return Response.json({ 
      success: false, 
      message: 'Invalid username or password' 
    }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    
    // Return a generic error message
    return Response.json({ 
      success: false, 
      message: 'An error occurred during login' 
    }, { status: 500 });
  }
};

/**
 * Verify if the current token is valid
 * @param req - The request object
 * @returns A Response object with the result of the verification
 */
export const handleVerifyToken = (req: Request): Response => {
  // The request has already been authenticated by the middleware
  // If we reach this point, the token is valid
  return Response.json({ 
    success: true, 
    message: 'Token is valid' 
  });
};