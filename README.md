# Manager API

## Prerequisites

- Node.js (v24 or higher)
- npm
- Docker or Podman (for database)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update the values as needed:

```bash
cp .env.example .env
```

Default values in `.env.example`:
- PORT: 3000
- Database: PostgreSQL (credentials: postgres/postgres)
- JWT_SECRET: 123 (change this in production!)

### 3. Start the Database

Using Docker:

```bash 
make docker/up
```

Or using Podman:

```bash 
make podman/up
```

This will start:
- PostgreSQL database on port 5432
- Flyway migrations (automatic)

To stop:
```bash
make docker/down  # or make podman/down
```

### 4. Run the Application
Development mode with hot reload:

```bash
npm run start:dev
```

The API will be available at http://localhost:3000