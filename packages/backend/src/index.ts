import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import {handleContactForm} from "./handlers/handleContactForm";
import {handleAdminLogin, handleVerifyToken} from "./handlers/admin/auth";
import {getEvents, createEvent, updateEvent, deleteEvent} from "./handlers/admin/events";
import {getGallery, addGalleryImage, deleteGalleryImage, reorderGallery} from "./handlers/admin/gallery";
import {handleImageUpload} from "./handlers/admin/upload";
import {authenticateAdmin} from "./middleware/auth";

// Load environment variables
dotenv.config();

const FRONTEND_DIR = path.join(import.meta.dir, '../../frontend/dist');
const DATA_DIR = path.join(import.meta.dir, '../data');
const IMAGES_DIR = path.join(import.meta.dir, '../img');

const imageExtensions = ['.webp', '.png', '.jpg', '.jpeg', '.gif'];

// Check if the frontend build directory exists
if (!fs.existsSync(FRONTEND_DIR)) {
  console.error('Frontend build directory not found. Please run "bun run build" in the frontend workspace first.');
  process.exit(1);
}

// Define the server
const server = Bun.serve({
  port: process.env.PORT || 3000,

  // Define API routes
  routes: {
    // Public API endpoints
    "/api/events": () => {
      return Response.json(JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'events.json'), 'utf-8')));
    },

    "/api/gallery": () => {
      return Response.json(JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'gallery.json'), 'utf-8')));
    },

    "/api/contact": {
      POST: async (req) => {
        return await handleContactForm(req);
      }
    },

    // Admin authentication endpoints
    "/api/auth/login": {
      POST: async (req) => {
        return await handleAdminLogin(req);
      }
    },

    "/api/auth/verify": {
      GET: (req) => {
        // This endpoint is protected by the authenticateAdmin middleware
        const authResponse = authenticateAdmin(req);
        if (authResponse) return authResponse;

        return handleVerifyToken(req);
      }
    },

    // Admin events endpoints
    "/api/admin/events": {
      GET: async (req) => {
        return await getEvents(req);
      },
      POST: async (req) => {
        return await createEvent(req);
      }
    },

    "/api/admin/events/:id": {
      PUT: async (req) => {
        const id = parseInt(req.params.id);
        return await updateEvent(req, id);
      },
      DELETE: async (req) => {
        const id = parseInt(req.params.id);
        return await deleteEvent(req, id);
      }
    },

    // Admin gallery endpoints
    "/api/admin/gallery": {
      GET: async (req) => {
        return await getGallery(req);
      },
      POST: async (req) => {
        return await addGalleryImage(req);
      }
    },

    "/api/admin/gallery/:id": {
      DELETE: async (req) => {
        const id = parseInt(req.params.id);
        return await deleteGalleryImage(req, id);
      }
    },

    "/api/admin/gallery/reorder": {
      POST: async (req) => {
        return await reorderGallery(req);
      }
    },

    // Admin image upload endpoint
    "/api/admin/upload": {
      POST: async (req) => {
        return await handleImageUpload(req);
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

    // Handle admin routes - serve the same index.html for SPA routing
    if (requestPath.startsWith('/admin')) {
      return new Response(Bun.file(path.join(FRONTEND_DIR, 'index.html')));
    }

    // Try to serve images from IMAGES_DIR
    const requestedFileName = path.basename(requestPath);
    const requestedExt = path.extname(requestedFileName).toLowerCase();
    if (imageExtensions.includes(requestedExt)) {
      // Check if the image is in a subdirectory (events or gallery)
      let imagePath;
      if (requestPath.includes('/')) {
        // Extract the relative path from the request
        const relativePath = requestPath.startsWith('/') 
          ? requestPath.substring(1) 
          : requestPath;

        imagePath = path.join(IMAGES_DIR, relativePath);
      } else {
        // Just a filename, look in the root images directory
        imagePath = path.join(IMAGES_DIR, requestedFileName);
      }

      if (fs.existsSync(imagePath) && fs.statSync(imagePath).isFile()) {
        const file = Bun.file(imagePath);
        return new Response(file, {
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      } else {
        // If not found in IMAGES_DIR, try to serve from frontend build directory
        const filePath = path.join(FRONTEND_DIR, requestPath);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const file = Bun.file(filePath);
          return new Response(file, {
            headers: {
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }

        // Also check in the assets directory for hashed filenames
        if (requestPath.startsWith('/assets/')) {
          const assetsPath = path.join(FRONTEND_DIR, requestPath);
          if (fs.existsSync(assetsPath) && fs.statSync(assetsPath).isFile()) {
            const file = Bun.file(assetsPath);
            return new Response(file, {
              headers: {
                'Cache-Control': 'public, max-age=31536000, immutable',
              },
            });
          }
        }

        return new Response('Not Found', { status: 404 });
      }
    }

    // For SPA routing, serve index.html for any path that doesn't match a file
    if (requestPath.indexOf('.') === -1) {
      return new Response(Bun.file(path.join(FRONTEND_DIR, 'index.html')));
    }

    // Try to serve static files from the frontend build directory
    const filePath = path.join(FRONTEND_DIR, requestPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return new Response(Bun.file(filePath));
    }

    // Return 404 for files that don't exist
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);
