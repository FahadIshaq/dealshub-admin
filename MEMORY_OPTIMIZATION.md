# Memory Optimization Guide

This document outlines the memory optimizations implemented to resolve the "JavaScript heap out of memory" error during deployment on Render.

## Issues Identified

1. **Memory-intensive startup operations**: Migration and seed services were running synchronously during application bootstrap
2. **No memory limits**: Node.js was trying to use all available memory
3. **Large database queries**: Migration service was loading all users at once without pagination
4. **Blocking operations**: Heavy operations were blocking the main thread

## Solutions Implemented

### 1. Memory Limits Configuration

- Added `--max-old-space-size=512` flag to limit Node.js heap size to 512MB
- Updated both `start` and `start:prod` scripts in `package.json`

### 2. Asynchronous Startup Operations

- Modified `main.ts` to run migration and seed services asynchronously after app starts
- Added 1-second delay to prevent blocking the main thread
- Wrapped operations in try-catch for better error handling

### 3. Optimized Database Operations

#### Migration Service (`migration.service.ts`)
- Implemented batch processing with 50 users per batch
- Added pagination using `skip` and `limit`
- Used `.lean()` to get plain objects instead of full Mongoose documents
- Added delays between batches to prevent overwhelming the database
- Implemented parallel processing with error handling

#### Seed Service (`seed.service.ts`)
- Added delays between user creation operations
- Improved logging and error handling
- Reduced memory pressure by spacing out operations

### 4. Health Check Endpoint

- Added `/health` endpoint for deployment monitoring
- Returns application status, timestamp, and uptime
- Updated Render configuration to use this endpoint

### 5. Development Tools

- Created memory monitoring script (`scripts/memory-monitor.js`)
- Added `start:memory` script with garbage collection enabled
- Added `memory:check` script for quick memory usage inspection

## Render Configuration

Created `render.yaml` with:
- Memory optimization environment variables
- Proper health check path
- Starter plan configuration

## Usage

### Production Deployment
```bash
npm run start:prod
```

### Development with Memory Monitoring
```bash
npm run start:memory
```

### Check Memory Usage
```bash
npm run memory:check
```

## Environment Variables

Set these in your Render environment:
- `NODE_OPTIONS=--max-old-space-size=512`
- `NODE_ENV=production`
- `PORT=3001`

## Monitoring

The application now includes:
- Memory usage logging
- Health check endpoint at `/health`
- Better error handling and logging
- Graceful degradation for memory-intensive operations

## Best Practices

1. **Always use pagination** for large database queries
2. **Implement batch processing** for bulk operations
3. **Add delays** between heavy operations
4. **Use `.lean()`** for read-only database operations
5. **Monitor memory usage** during development
6. **Set appropriate memory limits** for production deployments 