# School Demo API Server

This repository contains a simple API server for a school website, implementing endpoints for contact forms, admission inquiries, and MongoDB connection testing.

## Features

- Contact form submission API
- Admission inquiry API
- MongoDB connection testing API
- Easy setup with minimal dependencies

## Prerequisites

- Node.js v14 or higher
- MongoDB installed and running locally
- npm package manager

## Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd School-demo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure MongoDB:
   - Make sure MongoDB is running on your machine
   - Edit `.env` file to configure MongoDB connection:
   ```
   MONGODB_URI=mongodb://localhost:27017/schooldb
   ```

## Running the Server

There are multiple ways to run the server:

### Simple API Server (Recommended)

```
node simple-api-server.cjs
```

This starts a simple Express server with all API endpoints properly configured.

### Development Server

```
npm run dev
```

This starts the Vite development server for the frontend.

### Combined Server

```
npm start
```

This starts both the API server and the Vite development server concurrently.

## API Endpoints

### Contact Form

**POST /api/contact**

Submit a contact form.

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "subject": "General Inquiry",
  "message": "Hello, I have a question..."
}
```

### Admission Inquiry

**POST /api/admission/test**

Submit an admission inquiry.

Request body:
```json
{
  "studentName": "Jane Doe",
  "parentName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "classInterested": "Class 7",
  "message": "Interested in science programs..."
}
```

### MongoDB Test

**POST /api/mongo-test**

Test a MongoDB connection string.

Request body:
```json
{
  "connectionString": "mongodb://localhost:27017/schooldb"
}
```

For testing the default connection string, just send an empty POST request.

## Testing

### API Test Script

To test the API endpoints:

```
node api-test.mjs
```

### MongoDB Connection Test

To test the MongoDB connection:

```
node mongo-simple-test.cjs
```

### Verify Data

To check data has been saved to MongoDB:

```
node verify-data.cjs
```

## Troubleshooting

If you encounter issues with the API server:

1. Make sure MongoDB is running
2. Check if the connection string is correct
3. Look for error messages in the console
4. Try using the simple-api-server.cjs instead of the more complex server

For MongoDB connection issues:

1. Try using `127.0.0.1` instead of `localhost`
2. Check if authentication is required and add credentials
3. Verify the database name is correct
4. Check if MongoDB is running on the correct port (default is 27017)

## License

ISC