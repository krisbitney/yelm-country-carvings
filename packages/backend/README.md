# Backend Package - Domain-Driven Design Architecture

This package has been refactored to follow Domain-Driven Design (DDD) principles, providing a more maintainable, scalable, and testable architecture.

## Architecture Overview

The application is structured into four main layers:

### 1. Domain Layer

The heart of the application containing business logic and domain models.

- **Models**: Rich domain entities with validation logic
- **Interfaces**: Contracts for repositories and services
- **Services**: Core business logic implementation

### 2. Application Layer

Orchestrates the domain objects to perform application tasks.

- **Services**: Coordinates domain operations
- **DTOs**: Data Transfer Objects for API requests/responses

### 3. Infrastructure Layer

Provides technical capabilities to support higher layers.

- **Persistence**: File-based repositories
- **Services**: External service implementations (email, file storage, etc.)
- **Config**: Application configuration

### 4. Interface Layer

Exposes the application's functionality to external systems.

- **API Controllers**: Handles HTTP requests and responses
- **Middleware**: Authentication, error handling, and validation
- **Routes**: API endpoint definitions
- **Server**: HTTP server configuration

## Dependency Flow

Dependencies flow inward, with the domain layer being the most independent:

```
Interface → Application → Domain ← Infrastructure
```

## Key Benefits

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Testability**: Components can be tested in isolation
3. **Maintainability**: Changes in one layer don't affect others
4. **Flexibility**: Implementation details can be changed without affecting business logic
5. **Domain Focus**: Business rules are centralized in the domain layer

## Running the Application

```bash
# Install dependencies
bun install

# Start the development server
bun run dev

# Build for production
bun run build
```

## API Endpoints

The application exposes the following API endpoints:

### Public Endpoints

- `GET /api/events` - Get all events
- `GET /api/gallery` - Get all gallery items
- `POST /api/contact` - Submit a contact form

### Authentication Endpoints

- `POST /api/auth/login` - Login as admin
- `GET /api/auth/verify` - Verify authentication token

### Admin Endpoints (Requires Authentication)

- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event
- `POST /api/gallery` - Add a gallery item
- `PUT /api/gallery/:id` - Update a gallery item
- `DELETE /api/gallery/:id` - Delete a gallery item
- `POST /api/gallery/reorder` - Reorder gallery items
- `POST /api/upload` - Upload a file
- `DELETE /api/upload` - Delete a file
- `PUT /api/auth/password/:username` - Update user password
- `POST /api/auth/users` - Create a new user

## Implementation Details

### Domain Models

- `Event`: Represents market events with validation rules
- `GalleryItem`: Represents gallery images with metadata
- `User`: Represents admin users with authentication properties
- `ContactMessage`: Represents contact form submissions

### Domain Services

- `EventService`: Business operations for events
- `GalleryService`: Business operations for gallery items
- `AuthenticationService`: Domain-specific authentication logic

### Application Services

- `EventApplicationService`: Coordinates event operations
- `GalleryApplicationService`: Coordinates gallery operations
- `AuthApplicationService`: Handles authentication flows
- `ContactApplicationService`: Processes contact form submissions
- `FileUploadService`: Manages file uploads and processing

### Infrastructure Services

- `EmailService`: Handles email communication
- `FileStorageService`: Manages file storage
- `TokenService`: Handles JWT operations

### Controllers

- `EventController`: Event-related endpoints
- `GalleryController`: Gallery-related endpoints
- `AuthController`: Authentication endpoints
- `ContactController`: Contact form endpoint
- `UploadController`: File upload endpoints

### Middleware

- `authMiddleware`: Authentication middleware
- `errorMiddleware`: Error handling middleware
- `validationMiddleware`: Request validation middleware
