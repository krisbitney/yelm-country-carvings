import '../../../src/index';
import { describe, test, expect, beforeEach, beforeAll, afterAll } from 'bun:test';
import {
  getGallery,
  addGalleryImage,
  deleteGalleryImage,
  reorderGallery,
} from '../../../src/handlers/admin/gallery';
import { closeTestDb, setupTestDb, teardownTestDb } from '../../utils/testDb';
import {
  createTestRequest,
  createTestToken,
  insertTestGallery,
  readTestGallery,
} from '../../utils/helpers';
import { setupTestEventImage } from '../../utils/imageUtils';

describe('Gallery Handler', () => {
  // Sample gallery image data for testing
  const sampleImage = {
    id: 1,
    src: 'gallery/test.webp',
    alt: 'Test Image',
    order: 1,
  };
  // Setup valid auth token
  const validToken = createTestToken({ username: 'admin' });
  const validAuthHeader = { Authorization: `Bearer ${validToken}` };

  let testSql: Bun.SQL;

  beforeAll(async () => {
    testSql = await setupTestDb();
  });

  afterAll(async () => {
    await closeTestDb(testSql);
  });

  // Set up test environment before each test
  beforeEach(async () => {
    await teardownTestDb(testSql);
  });

  describe('getGallery', () => {
    test('should return gallery images', async () => {
      // Setup existing gallery
      const existingGallery = [sampleImage];
      await insertTestGallery(testSql, existingGallery);

      // Call the handler
      const response = await getGallery();
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(1);
      expect(data[0].id).toBe(sampleImage.id);
      expect(data[0].src).toBe(sampleImage.src);
    });
  });

  describe('addGalleryImage', () => {
    test('should add a new gallery image', async () => {
      // Start with empty gallery
      await testSql`TRUNCATE TABLE gallery RESTART IDENTITY CASCADE`;

      // Create a request with valid auth and image data
      const newImage = {
        src: 'gallery/new.webp',
        alt: 'New Image',
      };

      const request = createTestRequest({
        method: 'POST',
        headers: validAuthHeader,
        body: newImage,
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

      // Verify the image was actually saved to the file
      const savedGallery = await readTestGallery(testSql);
      expect(savedGallery.length).toBe(1);
      expect(savedGallery[0].src).toBe(newImage.src);
      expect(savedGallery[0].alt).toBe(newImage.alt);
      expect(savedGallery[0].id).toBe(data.image.id);
    });
  });

  describe('deleteGalleryImage', () => {
    test('should delete an existing gallery image', async () => {
      // Setup existing gallery
      const existingGallery = [sampleImage];
      await insertTestGallery(testSql, existingGallery);
      await setupTestEventImage('gallery');

      // Call the handler
      const response = await deleteGalleryImage(1);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify the image was actually deleted from the file
      const savedGallery = await readTestGallery(testSql);
      expect(savedGallery.length).toBe(0);
    });

    test('should return 404 when image does not exist', async () => {
      // Start with empty gallery
      await testSql`TRUNCATE TABLE gallery RESTART IDENTITY CASCADE`;

      // Call the handler
      const response = await deleteGalleryImage(999);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });
  });

  describe('reorderGallery', () => {
    test('should reorder gallery images', async () => {
      // Setup existing gallery
      const existingGallery = [
        { id: 1, src: 'gallery/1.webp', alt: 'Image 1', order: 1 },
        { id: 2, src: 'gallery/2.webp', alt: 'Image 2', order: 2 },
        { id: 3, src: 'gallery/3.webp', alt: 'Image 3', order: 3 },
      ];
      await insertTestGallery(testSql, existingGallery);

      // Create a request with valid auth and new order
      const newOrder = { imageIds: [3, 1, 2] }; // New order of image IDs
      const request = createTestRequest({
        method: 'POST',
        headers: validAuthHeader,
        body: newOrder,
      });

      // Call the handler
      const response = await reorderGallery(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify the gallery was actually reordered in the file
      const savedGallery = await readTestGallery(testSql);
      expect(savedGallery.length).toBe(3);
      expect(savedGallery[0].id).toBe(3);
      expect(savedGallery[1].id).toBe(1);
      expect(savedGallery[2].id).toBe(2);
    });
  });
});
