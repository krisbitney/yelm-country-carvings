import { join } from 'path';
import { statSync, existsSync } from 'fs';
import { serve } from 'bun';

// Path to the frontend build directory
const FRONTEND_DIR = join(import.meta.dir, '../../frontend/dist');

// Check if the frontend build directory exists
if (!existsSync(FRONTEND_DIR)) {
  console.error('Frontend build directory not found. Please run "bun run build" in the frontend workspace first.');
  process.exit(1);
}

// Define the server
const server = serve({
  port: process.env.PORT || 3000,
  fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;
    
    // Default to index.html for the root path
    if (path === '/') {
      path = '/index.html';
    }
    
    // Construct the file path
    const filePath = join(FRONTEND_DIR, path);
    
    // Check if the file exists
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      // Serve the file
      return new Response(Bun.file(filePath));
    }
    
    // For SPA routing, serve index.html for any path that doesn't match a file
    if (path.indexOf('.') === -1) {
      return new Response(Bun.file(join(FRONTEND_DIR, 'index.html')));
    }
    
    // Return 404 for files that don't exist
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);