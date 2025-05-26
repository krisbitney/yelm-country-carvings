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

// Add specific CSP for HTML documents if this is index.html
export const getIndexHtmlHeaders = (origin?: string | null) => {
  const csp = [
    `default-src 'self'`,
    `img-src     'self' data:`,
    `script-src  'self' 'unsafe-inline'`,
    `style-src   'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src    'self' https://fonts.gstatic.com`,
    `connect-src 'self'`,
    // allow any frame from google.com or its /maps/embed endpoint
    `frame-src   https://www.google.com https://www.google.com/maps/embed`,
    // older browsers use child-src as the fallback for <iframe>
    `child-src   https://www.google.com`,
  ].join('; ');

  return {
    'Content-Security-Policy': csp,
    ...getCORSHeaders(origin),
  };
};

// Helper to apply headers to a Response object
export const applyHeaders = async (response: Response, headers: Record<string, string>) => {
  const newHeaders = new Headers(response.headers);
  Object.entries(headers).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

// API response creation helpers
export const createAPIResponse = async (data: unknown, status = 200) => {
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
