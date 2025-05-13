// Import setup first to ensure environment variables are set
import '../../setup';
import "../../../src/index";
import {describe, test, expect, beforeEach, beforeAll, afterAll} from 'bun:test';
import { getGallery, addGalleryImage, deleteGalleryImage, reorderGallery } from '../../../src/handlers/admin/gallery';
import {closeTestDb, setupTestDb, teardownTestDb} from '../../utils/testDb';
import {createTestRequest, createTestToken} from "../../utils/helpers";

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

  // Helper function to insert test gallery images into the database
  const insertTestGallery = async (gallery) => {
    for (const image of gallery) {
      await testSql`
        INSERT INTO gallery (
          id, 
          src, 
          alt, 
          order_position
        ) 
        VALUES (
          ${image.id}, 
          ${image.src}, 
          ${image.alt}, 
          ${image.order}
        )
      `;
    }
  };

  // Helper function to read test gallery from the database
  const readTestGallery = async () => {
    return await testSql`
      SELECT 
        id, 
        src, 
        alt, 
        order_position as "order" 
      FROM gallery 
      ORDER BY order_position
    `;
  };

  describe('getGallery', () => {
    test('should return gallery images when authenticated', async () => {
      // Setup existing gallery
      const existingGallery = [sampleImage];
      await insertTestGallery(existingGallery);

      // Create a request with valid auth
      const request = createTestRequest({
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
      expect(data[0].src).toBe(sampleImage.src);
    });

    test('should return 401 when not authenticated', async () => {
      // Create a request without auth
      const request = createTestRequest({
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
      // Start with empty gallery
      await testSql`TRUNCATE TABLE gallery RESTART IDENTITY CASCADE`;

      // Create a request with valid auth and image data
      const newImage = {
        src: 'gallery/new.webp',
        alt: 'New Image'
      };

      const request = createTestRequest({
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

      // Verify the image was actually saved to the file
      const savedGallery = await readTestGallery();
      expect(savedGallery.length).toBe(1);
      expect(savedGallery[0].src).toBe(newImage.src);
      expect(savedGallery[0].alt).toBe(newImage.alt);
      expect(savedGallery[0].id).toBe(data.image.id);
    });

    test('should return 401 when not authenticated', async () => {
      // Create a request without auth
      const request = createTestRequest({
        method: 'POST',
        body: { src: 'gallery/test.webp', alt: 'Test Image' }
      });

      // Call the handler
      const response = await addGalleryImage(request);

      // Verify the response
      expect(response.status).toBe(401);

      // Verify no image was saved
      const savedGallery = await readTestGallery();
      expect(savedGallery.length).toBe(0);
    });
  });

  describe('deleteGalleryImage', () => {
    test('should delete an existing gallery image when authenticated', async () => {
      // Setup existing gallery
      const existingGallery = [sampleImage];
      await insertTestGallery(existingGallery);

      // Create a request with valid auth
      const request = createTestRequest({
        method: 'DELETE',
        headers: validAuthHeader
      });

      // Call the handler
      const response = await deleteGalleryImage(request, 1);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify the image was actually deleted from the file
      const savedGallery = await readTestGallery();
      expect(savedGallery.length).toBe(0);
    });

    test('should return 404 when image does not exist', async () => {
      // Start with empty gallery
      await testSql`TRUNCATE TABLE gallery RESTART IDENTITY CASCADE`;

      // Create a request with valid auth
      const request = createTestRequest({
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
      // Setup existing gallery
      const existingGallery = [sampleImage];
      await insertTestGallery(existingGallery);

      // Create a request without auth
      const request = createTestRequest({
        method: 'DELETE'
      });

      // Call the handler
      const response = await deleteGalleryImage(request, 1);

      // Verify the response
      expect(response.status).toBe(401);

      // Verify the image was not deleted
      const savedGallery = await readTestGallery();
      expect(savedGallery.length).toBe(1);
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
      await insertTestGallery(existingGallery);

      // Create a request with valid auth and new order
      const newOrder = { imageIds: [3, 1, 2] }; // New order of image IDs
      const request = createTestRequest({
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

      // Verify the gallery was actually reordered in the file
      const savedGallery = await readTestGallery();
      expect(savedGallery.length).toBe(3);
      expect(savedGallery[0].id).toBe(3);
      expect(savedGallery[1].id).toBe(1);
      expect(savedGallery[2].id).toBe(2);
    });

    test('should return 401 when not authenticated', async () => {
      // Setup existing gallery
      const existingGallery = [
        { id: 1, src: 'gallery/1.webp', alt: 'Image 1', order: 1 },
        { id: 2, src: 'gallery/2.webp', alt: 'Image 2', order: 2 },
        { id: 3, src: 'gallery/3.webp', alt: 'Image 3', order: 3 }
      ];
      await insertTestGallery(existingGallery);

      // Create a request without auth
      const request = createTestRequest({
        method: 'POST',
        body: { imageIds: [1, 2, 3] }
      });

      // Call the handler
      const response = await reorderGallery(request);

      // Verify the response
      expect(response.status).toBe(401);

      // Verify the gallery was not reordered
      const savedGallery = await readTestGallery();
      expect(savedGallery.length).toBe(3);
      expect(savedGallery[0].id).toBe(1);
      expect(savedGallery[1].id).toBe(2);
      expect(savedGallery[2].id).toBe(3);
    });
  });
});
