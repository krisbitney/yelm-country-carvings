import path from 'path';
import fs from 'fs';
import { handleContactForm } from './handlers/handleContactForm';
import { handleAdminLogin, handleVerifyToken } from './handlers/admin/auth';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getAvailableYears,
} from './handlers/admin/events';
import {
  getGallery,
  addGalleryImage,
  deleteGalleryImage,
  reorderGallery,
} from './handlers/admin/gallery';
import { handleImageUpload } from './handlers/admin/upload';
import { authenticateJWT } from './middleware/auth';
import { eventRepository } from './repositories/eventRepository';
import { galleryRepository } from './repositories/galleryRepository';
import { safeJoin, serveCompressed } from './utils/serve';

const FRONTEND_DIR = path.join(import.meta.dir, '../../frontend/dist');
// Check if the frontend build directory exists
if (!fs.existsSync(FRONTEND_DIR)) {
  console.error(
    'Frontend build directory not found. Please run "bun run build" in the frontend workspace first.'
  );
  process.exit(1);
}

// Get the appropriate file paths based on environment
export const IMAGES_DIR: string =
  process.env.NODE_ENV === 'test'
    ? path.join(import.meta.dir, '../test/test-images')
    : path.join(import.meta.dir, '../img');
// Ensure the gallery images directory exists
try {
  fs.mkdirSync(path.join(IMAGES_DIR, 'gallery'), { recursive: true });
  fs.mkdirSync(path.join(IMAGES_DIR, 'events'), { recursive: true });
} catch (error) {
  console.error('Error creating gallery or events images directory:', error);
}

const imageExtensions = ['.webp', '.png', '.jpg', '.jpeg', '.gif'];

// Define the server
const server = Bun.serve({
  port: process.env.PORT || 3000,

  // Define API routes
  routes: {
    // Public API endpoints
    '/api/events': async () => {
      try {
        const events = await eventRepository.getAll();
        return Response.json(events);
      } catch (error) {
        console.error('Error getting events:', error);
        return Response.json({ success: false, message: 'Failed to get events' }, { status: 500 });
      }
    },

    '/api/upcoming-events': async () => {
      try {
        const upcomingEvents = await eventRepository.getUpcoming();
        return Response.json(upcomingEvents);
      } catch (error) {
        console.error('Error getting upcoming events:', error);
        return Response.json(
          { success: false, message: 'Failed to get upcoming events' },
          { status: 500 }
        );
      }
    },

    '/api/gallery': async () => {
      try {
        const gallery = await galleryRepository.getAll();
        return Response.json(gallery);
      } catch (error) {
        console.error('Error getting gallery:', error);
        return Response.json({ success: false, message: 'Failed to get gallery' }, { status: 500 });
      }
    },

    '/api/contact': {
      POST: async req => {
        return await handleContactForm(req);
      },
    },

    // Admin authentication endpoints
    '/api/auth/login': {
      POST: async req => {
        return await handleAdminLogin(req);
      },
    },

    '/api/auth/verify': {
      GET: req => {
        return authenticateJWT(req) ?? handleVerifyToken(req);
      },
    },

    // Admin events endpoints
    '/api/admin/events': {
      GET: async req => {
        return authenticateJWT(req) ?? (await getEvents(req));
      },
      POST: async req => {
        return authenticateJWT(req) ?? (await createEvent(req));
      },
    },

    '/api/admin/events/years': {
      GET: async req => {
        return authenticateJWT(req) ?? (await getAvailableYears());
      },
    },

    '/api/admin/events/:id': {
      PUT: async req => {
        const raw = req.params.id;
        const id = Number(raw);
        if (!Number.isInteger(id)) {
          return new Response('Invalid ID', { status: 400 });
        }
        return authenticateJWT(req) ?? (await updateEvent(req, id));
      },
      DELETE: async req => {
        const raw = req.params.id;
        const id = Number(raw);
        if (!Number.isInteger(id)) {
          return new Response('Invalid ID', { status: 400 });
        }
        return authenticateJWT(req) ?? (await deleteEvent(id));
      },
    },

    // Admin gallery endpoints
    '/api/admin/gallery': {
      GET: async req => {
        return authenticateJWT(req) ?? (await getGallery());
      },
      POST: async req => {
        return authenticateJWT(req) ?? (await addGalleryImage(req));
      },
    },

    '/api/admin/gallery/:id': {
      DELETE: async req => {
        const raw = req.params.id;
        const id = Number(raw);
        if (!Number.isInteger(id)) {
          return new Response('Invalid ID', { status: 400 });
        }
        return authenticateJWT(req) ?? (await deleteGalleryImage(id));
      },
    },

    '/api/admin/gallery/reorder': {
      POST: async req => {
        return authenticateJWT(req) ?? (await reorderGallery(req));
      },
    },

    // Admin image upload endpoint
    '/api/admin/upload': {
      POST: async req => {
        return authenticateJWT(req) ?? (await handleImageUpload(req));
      },
    },
  },

  // Fallback handler for non-API routes
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const requestPath = url.pathname;
    const requestedFileName = path.basename(requestPath);
    const requestedExt = path.extname(requestedFileName).toLowerCase();
    const acceptEncoding = req.headers.get('accept-encoding') || '';

    let filePath: string | null;

    // 1. Serve index.html for root, admin paths, or SPA-style routes (no extension)
    if (
      requestPath === '/' ||
      requestPath.startsWith('/admin') ||
      requestPath.indexOf('.') === -1
    ) {
      filePath = path.join(FRONTEND_DIR, 'index.html');
    } else {
      // 2. Try to serve images from backend
      if (imageExtensions.includes(requestedExt)) {
        filePath = safeJoin(IMAGES_DIR, requestPath);
        // 3. Try to serve other static files from the frontend build directory
      } else {
        filePath = safeJoin(FRONTEND_DIR, requestPath);
      }
    }

    const response = await serveCompressed(filePath, acceptEncoding);
    if (response) return response;

    // 4. Return 404 if nothing matched
    return new Response(`Not Found: ${requestPath}`, { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);
