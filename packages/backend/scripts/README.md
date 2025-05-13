# Database Migration Scripts

This directory contains scripts for migrating from filesystem-based storage to PostgreSQL database.

## Prerequisites

- PostgreSQL database server running (can be started with `docker-compose up -d`)
- Environment variables configured in `.env` file

## Available Scripts

### Create Database Schema

Creates the database tables and indexes:

```bash
bun run db:create-schema
```

### Migrate Events

Migrates events from JSON file to the database:

```bash
bun run db:migrate:events
```

### Migrate Gallery

Migrates gallery images from JSON file to the database:

```bash
bun run db:migrate:gallery
```

### Migrate All

Runs all migration scripts in the correct order:

```bash
bun run db:migrate:all
```

### Backup Database

Creates a backup of the database:

```bash
bun run db:backup
```

## Migration Process

1. Start the PostgreSQL database:
   ```bash
   docker-compose up -d
   ```

2. Create the database schema:
   ```bash
   bun run db:create-schema
   ```

3. Migrate the data:
   ```bash
   bun run db:migrate:all
   ```

4. Verify the migration:
   ```bash
   # Start the application
   bun run dev
   
   # Check that data is accessible through the API
   curl http://localhost:3000/api/events
   curl http://localhost:3000/api/gallery
   ```

5. Create a backup (optional):
   ```bash
   bun run db:backup
   ```

## Notes

- The migration scripts are idempotent and can be run multiple times without duplicating data
- Backups are stored in the `backups` directory with timestamps
- The application will continue to work with the filesystem-based storage until the migration is complete