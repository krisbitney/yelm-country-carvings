import { describe, test, expect, mock, spyOn } from 'bun:test';
import { handleContactForm } from '../../src/handlers/handleContactForm';
import { createMockRequest } from '../setup';
import '../setup';

describe('Contact Form Handler', () => {
  test('should successfully process a valid contact form submission', async () => {
    // Create a mock FormData
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('email', 'test@example.com');
    formData.append('phone', '123-456-7890');
    formData.append('message', 'This is a test message');
    
    // Create a mock request with the form data
    const request = createMockRequest({
      method: 'POST',
      formData
    });
    
    // Mock the formData method to return our form data
    request.formData = mock(async () => formData);
    
    // Call the handler
    const response = await handleContactForm(request);
    const data = await response.json();
    
    // Verify the response
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain('sent successfully');
  });
  
  test('should handle form submission with file attachment', async () => {
    // Create a mock FormData with file
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('email', 'test@example.com');
    formData.append('message', 'This is a test message with attachment');
    
    // Create a mock file
    const fileContent = 'test file content';
    const file = new File([fileContent], 'test.txt', { type: 'text/plain' });
    formData.append('file', file);
    
    // Create a mock request with the form data
    const request = createMockRequest({
      method: 'POST',
      formData
    });
    
    // Mock the formData method to return our form data
    request.formData = mock(async () => formData);
    
    // Call the handler
    const response = await handleContactForm(request);
    const data = await response.json();
    
    // Verify the response
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
  
  test('should return 400 when required fields are missing', async () => {
    // Create a mock FormData with missing required fields
    const formData = new FormData();
    formData.append('name', 'Test User');
    // Missing email
    formData.append('message', ''); // Empty message
    
    // Create a mock request with the form data
    const request = createMockRequest({
      method: 'POST',
      formData
    });
    
    // Mock the formData method to return our form data
    request.formData = mock(async () => formData);
    
    // Call the handler
    const response = await handleContactForm(request);
    const data = await response.json();
    
    // Verify the response
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toContain('Missing required fields');
  });
  
  test('should handle errors during email sending', async () => {
    // Create a mock FormData
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('email', 'test@example.com');
    formData.append('message', 'This is a test message');
    
    // Create a mock request with the form data
    const request = createMockRequest({
      method: 'POST',
      formData
    });
    
    // Mock the formData method to return our form data
    request.formData = mock(async () => formData);
    
    // Mock console.error to suppress error logs in tests
    const originalConsoleError = console.error;
    console.error = mock(() => {});
    
    // Force an error in the email sending process by mocking the setup file's SMTP2GO mock
    // This relies on the mock in setup.ts, but we override the consume method to throw an error
    const smtp2goMock = await import('smtp2go-nodejs');
    const clientMock = smtp2goMock.default(process.env.SMTP2GO_API_KEY).client();
    spyOn(clientMock, 'consume').mockImplementation(() => {
      throw new Error('SMTP error');
    });
    
    // Call the handler
    const response = await handleContactForm(request);
    const data = await response.json();
    
    // Restore console.error
    console.error = originalConsoleError;
    
    // Verify the response
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toContain('Failed to send message');
  });
});