// Define standard header sets for different response types
export const getSecurityHeaders = () => ({
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
});

export const getCORSHeaders = (origin?: string | null) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 24 hours
});

export const getAPIResponseHeaders = () => ({
  'Content-Type': 'application/json',
  ...getSecurityHeaders(),
});

export const getStaticFileHeaders = (contentType: string, immutable = false) => ({
  'Content-Type': contentType,
  'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
  ...getSecurityHeaders(),
});

// Helper to apply headers to a Response object
export const applyHeaders = async (response: Response, headers: Record<string, string>) => {
  // Clone the response to ensure we can read the body
  const clonedResponse = response.clone();

  // Get the response body as JSON
  let body;
  try {
    body = await clonedResponse.json();
  } catch (error) {
    // If the body is not JSON, use the original body
    body = response.body;
  }

  const newHeaders = new Headers(response.headers);
  Object.entries(headers).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  // Create a new response with the same body and status, but with updated headers
  return new Response(JSON.stringify(body), {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

// API response creation helpers
export const createAPIResponse = async (data: any, status = 200) => {
  const response = Response.json(data, { status });
  return await applyHeaders(response, {
    ...getAPIResponseHeaders(),
    ...getCORSHeaders(),
  });
};

export const createErrorResponse = async (message: string, status = 500) => {
  const response = Response.json({ success: false, message }, { status });
  return await applyHeaders(response, {
    ...getAPIResponseHeaders(),
    ...getCORSHeaders(),
  });
};
