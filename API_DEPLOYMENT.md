# API Deployment Guide

This document explains how to configure the API for deployment to prevent the "No response from server" error.

## Local Development

For local development, the API uses the URL from your `.env.development` file:

```
VITE_API_URL=http://localhost:5000
```

## Production Deployment

For production deployment, you need to:

1. Ensure your backend server is running and accessible
2. Update the `.env.production` file with your actual backend URL:

```
VITE_API_URL=https://your-actual-backend-url.com
```

## How the API Configuration Works

The application uses a centralized API client configuration in `src/api/config.js` which:

1. Reads the API URL from environment variables
2. Configures axios with proper error handling
3. Provides a consistent interface for all API calls

Each API service (e.g., contactService, admissionService) uses this configuration to make requests.

## Troubleshooting

If you encounter the "No response from server" error:

1. Check if your backend server is running
2. Verify the API URL in your environment file is correct
3. Check for CORS issues if the frontend and backend are on different domains
4. Ensure your backend endpoints match the paths expected by the frontend
5. Check network connectivity between the frontend and backend

## Services

The following services have been configured to use the centralized API client:

- Contact Form: `src/api/contactService.js`
- Admission Inquiry: `src/api/admissionService.js`

When adding new API services, follow the same pattern to ensure consistent error handling and configuration. 