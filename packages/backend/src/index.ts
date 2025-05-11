import path from 'path';
import fs from 'fs';
import {handleContactForm} from "./handlers/handleContactForm";

const FRONTEND_DIR = path.join(import.meta.dir, '../../frontend/dist');
const DATA_DIR = path.join(import.meta.dir, 'data');
const IMAGES_DIR = path.join(import.meta.dir, 'img');

const imageExtensions = ['.webp', '.png', '.jpg', '.jpeg', '.gif'];

// Check if the frontend build directory exists
if (!fs.existsSync(FRONTEND_DIR)) {
  console.error('Frontend build directory not found. Please run "bun run build" in the frontend workspace first.');
  process.exit(1);
}

// Load events and gallery data
const events = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'events.json'), 'utf-8'));
const gallery = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'gallery.json'), 'utf-8'));

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
    let requestPath = url.pathname;

    // Default to index.html for the root path
    if (requestPath === '/') {
      requestPath = '/index.html';
    }

    // Try to serve images from IMAGES_DIR
    const requestedFileName = path.basename(requestPath);
    const requestedExt = path.extname(requestedFileName).toLowerCase();
    if (imageExtensions.includes(requestedExt)) {
      const imagePath = path.join(IMAGES_DIR, requestedFileName);
      if (fs.existsSync(imagePath) && fs.statSync(imagePath).isFile()) {
        const file = Bun.file(imagePath);
        return new Response(file, {
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });

      } else {
        return new Response('Not Found', { status: 404 });
      }
    }

    // For SPA routing, serve index.html for any path that doesn't match a file
    if (requestPath.indexOf('.') === -1) {
      return new Response(Bun.file(path.join(FRONTEND_DIR, 'index.html')));
    }

    // Return 404 for files that don't exist
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);
