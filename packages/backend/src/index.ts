import path from 'path';
import { existsSync, readFileSync } from 'fs';
import {handleContactForm} from "./handlers/handleContactForm";

// Path to the frontend build directory
const FRONTEND_DIR = path.join(import.meta.dir, '../../frontend/dist');

// Path to the data directory
const DATA_DIR = path.join(import.meta.dir, 'data');

// Check if the frontend build directory exists
if (!existsSync(FRONTEND_DIR)) {
  console.error('Frontend build directory not found. Please run "bun run build" in the frontend workspace first.');
  process.exit(1);
}

// Load events and gallery data
const events = JSON.parse(readFileSync(path.join(DATA_DIR, 'events.json'), 'utf-8'));
const gallery = JSON.parse(readFileSync(path.join(DATA_DIR, 'gallery.json'), 'utf-8'));

// Define the server
const server = Bun.serve({
  port: process.env.PORT || 3000,

  // Define API routes
  routes: {
    // API endpoint to get events
    "/api/events": () => {
      return Response.json(events);
    },

    // API endpoint to get gallery images
    "/api/gallery": () => {
      return Response.json(gallery);
    },

    // API endpoint to handle contact form submissions
    "/api/contact": {
      POST: async (req) => {
        return await handleContactForm(req);
      }
    }
  },

  // Fallback handler for non-API routes
  fetch(req) {
    const url = new URL(req.url);
    let endpoint = url.pathname;

    // Default to index.html for the root path
    if (endpoint === '/') {
      endpoint = '/index.html';
    }

    // For SPA routing, serve index.html for any path that doesn't match a file
    if (endpoint.indexOf('.') === -1) {
      return new Response(Bun.file(path.join(FRONTEND_DIR, 'index.html')));
    }

    // Return 404 for files that don't exist
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);
