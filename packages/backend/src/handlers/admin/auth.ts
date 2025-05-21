import { generateToken, verifyToken, extractTokenFromHeader } from '../../utils/jwt';

// Get admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
// For testing, defaults to hash for 'secure_password'
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  '$argon2id$v=19$m=65536,t=2,p=1$doboF/ae2w/97TeRbu6tluTTmrf5luSobD/OeiQHZA4$6t2GTpeHAQdgdhjp6wIOyj2JsCVTEQl8NkjOrv7Ky6I';

/**
 * Handle admin login
 * @param req - The request object
 * @returns A Response object with the result of the login attempt
 */
export const handleAdminLogin = async (req: Request): Promise<Response> => {
  try {
    // Parse the request body
    const { username, password } = await req.json();

    // Check if username is valid
    if (username !== ADMIN_USERNAME) {
      return Response.json(
        {
          success: false,
          message: 'Invalid username or password',
        },
        { status: 401 }
      );
    }

    // Validate the password using Bun's native password utilities
    const isPasswordValid = await Bun.password.verify(password, ADMIN_PASSWORD_HASH);

    // Check if credentials are valid
    if (!isPasswordValid) {
      return Response.json(
        {
          success: false,
          message: 'Invalid username or password',
        },
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = generateToken({ username });

    // Return the token
    return Response.json({
      success: true,
      token,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);

    // Return a generic error message
    return Response.json(
      {
        success: false,
        message: 'An error occurred during login',
      },
      { status: 500 }
    );
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

  // Extract the token from the Authorization header to get the username
  const authHeader = req.headers.get('Authorization');
  const token = extractTokenFromHeader(authHeader || '');

  // This should never happen since the middleware already checked for a valid token
  if (!token) {
    return Response.json(
      {
        success: false,
        message: 'No token provided',
      },
      { status: 401 }
    );
  }

  // Get the payload from the token
  const payload = verifyToken(token);

  // This should never happen since the middleware already verified the token
  if (!payload) {
    return Response.json(
      {
        success: false,
        message: 'Invalid token',
      },
      { status: 401 }
    );
  }

  // Return success with the username
  return Response.json({
    success: true,
    message: 'Token is valid',
    username: payload.username,
  });
};
