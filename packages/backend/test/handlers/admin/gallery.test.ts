import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { getGallery, addGalleryImage, deleteGalleryImage, reorderGallery } from '../../../src/handlers/admin/gallery';
import { createMockRequest, createTestToken } from '../../setup';
import '../../setup';

describe('Gallery Handler', () => {
  // Sample gallery image data for testing
  const sampleImage = {
    id: 1,
    src: 'gallery/test.webp',
    alt: 'Test Image',
    order: 1
  };

  // Setup valid auth token
  const validToken = createTestToken({ username: 'admin' });
  const validAuthHeader = { 'Authorization': `Bearer ${validToken}` };

  beforeEach(() => {
    // Reset mocks between tests
    mock.resetAll();
  });

  describe('getGallery', () => {
    test('should return gallery images when authenticated', async () => {
      // Setup existing gallery
      const existingGallery = [sampleImage];

      // Mock fs.readFile to return existing gallery
      mock.module('fs/promises', () => ({
        readFile: mock(async () => JSON.stringify(existingGallery)),
        writeFile: mock(async () => {}),
        mkdir: mock(async () => {}),
        unlink: mock(async () => {})
      }));

      // Create a mock request with valid auth
      const request = createMockRequest({
        method: 'GET',
        headers: validAuthHeader
      });

      // Call the handler
      const response = await getGallery(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(1);
      expect(data[0].id).toBe(sampleImage.id);
    });

    test('should return 401 when not authenticated', async () => {
      // Create a mock request without auth
      const request = createMockRequest({
        method: 'GET'
      });

      // Call the handler
      const response = await getGallery(request);

      // Verify the response
      expect(response.status).toBe(401);
    });
  });

  describe('addGalleryImage', () => {
    test('should add a new gallery image when authenticated', async () => {
      // Setup existing gallery
      const existingGallery = [];

      // Mock fs.readFile to return existing gallery
      mock.module('fs/promises', () => ({
        readFile: mock(async () => JSON.stringify(existingGallery)),
        writeFile: mock(async () => {}),
        mkdir: mock(async () => {}),
        unlink: mock(async () => {})
      }));

      // Create a mock request with valid auth and image data
      const newImage = {
        src: 'gallery/new.webp',
        alt: 'New Image'
      };

      const request = createMockRequest({
        method: 'POST',
        headers: validAuthHeader,
        body: newImage
      });

      // Call the handler
      const response = await addGalleryImage(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.image).toBeDefined();
      expect(data.image.src).toBe(newImage.src);
      expect(data.image.id).toBeDefined();
      expect(data.image.order).toBeDefined();
    });

    test('should return 401 when not authenticated', async () => {
      // Create a mock request without auth
      const request = createMockRequest({
        method: 'POST',
        body: { src: 'gallery/test.webp', alt: 'Test Image' }
      });

      // Call the handler
      const response = await addGalleryImage(request);

      // Verify the response
      expect(response.status).toBe(401);
    });

    test('should handle errors during image addition', async () => {
      // Create a mock request with valid auth and image data
      const request = createMockRequest({
        method: 'POST',
        headers: validAuthHeader,
        body: { src: 'gallery/test.webp', alt: 'Test Image' }
      });

      // Mock fs.writeFile to throw an error
      mock.module('fs/promises', () => ({
        readFile: mock(async () => JSON.stringify([])),
        writeFile: mock(async () => {
          throw new Error('Write error');
        }),
        mkdir: mock(async () => {}),
        unlink: mock(async () => {})
      }));

      // Mock console.error to suppress error logs
      const originalConsoleError = console.error;
      console.error = mock(() => {});

      // Call the handler
      const response = await addGalleryImage(request);
      const data = await response.json();

      // Restore console.error
      console.error = originalConsoleError;

      // Verify the response
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });
  });

  describe('deleteGalleryImage', () => {
    test('should delete an existing gallery image when authenticated', async () => {
      // Setup existing gallery
      const existingGallery = [sampleImage];

      // Mock fs.readFile to return existing gallery
      mock.module('fs/promises', () => ({
        readFile: mock(async () => JSON.stringify(existingGallery)),
        writeFile: mock(async () => {}),
        mkdir: mock(async () => {}),
        unlink: mock(async () => {})
      }));

      // Create a mock request with valid auth
      const request = createMockRequest({
        method: 'DELETE',
        headers: validAuthHeader
      });

      // Call the handler
      const response = await deleteGalleryImage(request, 1);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    test('should return 404 when image does not exist', async () => {
      // Setup existing gallery (empty array)
      const existingGallery = [];

      // Mock fs.readFile to return existing gallery
      mock.module('fs/promises', () => ({
        readFile: mock(async () => JSON.stringify(existingGallery)),
        writeFile: mock(async () => {}),
        mkdir: mock(async () => {}),
        unlink: mock(async () => {})
      }));

      // Create a mock request with valid auth
      const request = createMockRequest({
        method: 'DELETE',
        headers: validAuthHeader
      });

      // Call the handler
      const response = await deleteGalleryImage(request, 999);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });

    test('should return 401 when not authenticated', async () => {
      // Create a mock request without auth
      const request = createMockRequest({
        method: 'DELETE'
      });

      // Call the handler
      const response = await deleteGalleryImage(request, 1);

      // Verify the response
      expect(response.status).toBe(401);
    });
  });

  describe('reorderGallery', () => {
    test('should reorder gallery images when authenticated', async () => {
      // Setup existing gallery
      const existingGallery = [
        { id: 1, src: 'gallery/1.webp', alt: 'Image 1', order: 1 },
        { id: 2, src: 'gallery/2.webp', alt: 'Image 2', order: 2 },
        { id: 3, src: 'gallery/3.webp', alt: 'Image 3', order: 3 }
      ];

      // Mock fs.readFile to return existing gallery
      mock.module('fs/promises', () => ({
        readFile: mock(async () => JSON.stringify(existingGallery)),
        writeFile: mock(async () => {}),
        mkdir: mock(async () => {}),
        unlink: mock(async () => {})
      }));

      // Create a mock request with valid auth and new order
      const newOrder = [3, 1, 2]; // New order of image IDs
      const request = createMockRequest({
        method: 'POST',
        headers: validAuthHeader,
        body: newOrder
      });

      // Call the handler
      const response = await reorderGallery(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    test('should return 401 when not authenticated', async () => {
      // Create a mock request without auth
      const request = createMockRequest({
        method: 'POST',
        body: [1, 2, 3]
      });

      // Call the handler
      const response = await reorderGallery(request);

      // Verify the response
      expect(response.status).toBe(401);
    });

    test('should handle errors during reordering', async () => {
      // Create a mock request with valid auth and new order
      const request = createMockRequest({
        method: 'POST',
        headers: validAuthHeader,
        body: [1, 2, 3]
      });

      // Mock fs.writeFile to throw an error
      mock.module('fs/promises', () => ({
        readFile: mock(async () => JSON.stringify([
          { id: 1, src: 'gallery/1.webp', alt: 'Image 1', order: 1 },
          { id: 2, src: 'gallery/2.webp', alt: 'Image 2', order: 2 },
          { id: 3, src: 'gallery/3.webp', alt: 'Image 3', order: 3 }
        ])),
        writeFile: mock(async () => {
          throw new Error('Write error');
        }),
        mkdir: mock(async () => {}),
        unlink: mock(async () => {})
      }));

      // Mock console.error to suppress error logs
      const originalConsoleError = console.error;
      console.error = mock(() => {});

      // Call the handler
      const response = await reorderGallery(request);
      const data = await response.json();

      // Restore console.error
      console.error = originalConsoleError;

      // Verify the response
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });
  });
});