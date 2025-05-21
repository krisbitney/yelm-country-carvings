# Yelm Country Carvings

This project is a monorepo for the Yelm Country Carvings website, consisting of three main packages:

- **frontend**: The main public-facing website
- **admin-portal**: The admin portal for managing website content
- **backend**: The server that handles API requests for both the frontend and admin portal

## Features

### Main Website

- Responsive design for all devices
- Information about Yelm Country Carvings services
- Gallery of chainsaw carvings
- Contact form
- Events calendar

### Admin Portal

- Secure authentication system
- Events management (add, edit, delete)
- Gallery management (add, delete, reorder)
- Image upload functionality
- Responsive design

## Project Structure

```
yelm-country-carvings/
├── packages/
│   ├── frontend/         # Main public-facing website
│   ├── admin-portal/     # Admin portal for content management
│   └── backend/          # API server for both applications
├── .env                  # Environment variables
└── package.json          # Root package.json with workspace configuration
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Bun (latest version)

### Environment Configuration

1. Create a `.env` file in the project root with the following variables:

```
# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
# JWT secret for authentication
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

Replace the placeholder values with your actual secure credentials.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/yelm-country-carvings.git
cd yelm-country-carvings
```

2. Install dependencies:

```bash
bun install
```

3. Build all packages:

```bash
bun run build
```

Or build individual packages:

```bash
bun run build:frontend    # Build only the main website
bun run build:admin       # Build only the admin portal
bun run build:backend     # Build only the backend
```

4. Start the development server:

```bash
bun run dev               # Start the backend server
bun run dev:frontend      # Start the frontend development server
bun run dev:admin         # Start the admin portal development server
```

When running in development mode:

- The main website will be available at http://localhost:5173
- The admin portal will be available at http://localhost:5174 (or another port if 5174 is in use)
- The backend API will be available at http://localhost:3000

In production, the backend server will serve both the frontend and admin portal:

- The main website will be available at http://localhost:3000
- The admin portal will be available at http://localhost:3000/admin

## Usage

### Accessing the Admin Portal

1. Navigate to http://localhost:5174 in development mode or http://localhost:3000/admin in production
2. Log in with the credentials specified in your `.env` file

### Managing Events

1. From the admin dashboard, click "Manage Events"
2. To add a new event, click "Add New Event" and fill out the form
3. To edit an event, click "Edit" next to the event you want to modify
4. To delete an event, click "Delete" and confirm your action

### Managing Gallery

1. From the admin dashboard, click "Manage Gallery"
2. To add a new image, click "Add New Image", upload an image, and provide alt text
3. To reorder images, drag and drop them into the desired order
4. To delete an image, click "Delete" and confirm your action

## Security Considerations

- Change the default admin credentials and JWT secret in the `.env` file
- Use strong, unique passwords
- Keep your `.env` file secure and never commit it to version control
- In production, consider implementing additional security measures like rate limiting

## Troubleshooting

- If you encounter issues with image uploads, ensure the `img` directory and its subdirectories (`events` and `gallery`) have proper write permissions
- If authentication fails, check that your `.env` file is properly configured
- For other issues, check the server logs for error messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.
