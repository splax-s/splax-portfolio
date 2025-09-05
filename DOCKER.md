# Docker Usage

This project includes Docker support for easy deployment and development.

## Building and Running with Docker

### Using Docker directly:

```bash
# Build the image
docker build -t portfolio:latest .

# Run the container
docker run -d --name portfolio -p 3000:3000 portfolio:latest

# Check logs
docker logs portfolio

# Stop and remove
docker stop portfolio && docker rm portfolio
```

### Using Docker Compose (recommended):

```bash
# Build and start the service
docker-compose up -d

# Check logs
docker-compose logs

# Stop the service
docker-compose down

# Rebuild and restart
docker-compose up --build -d
```

## Docker Configuration

The Dockerfile uses a multi-stage build:
- **deps**: Installs production dependencies
- **build-deps**: Installs all dependencies (including dev dependencies)
- **builder**: Builds the Next.js application with all dependencies
- **runner**: Final production image with minimal dependencies

### Features:
- Optimized for production with Next.js standalone output
- Multi-stage build for smaller final image size
- Security-hardened with non-root user
- Health check support
- Proper caching for faster rebuilds

### Environment Variables:
- `NODE_ENV=production`
- `PORT=3000`
- `HOSTNAME=0.0.0.0`

The application will be available at http://localhost:3000
