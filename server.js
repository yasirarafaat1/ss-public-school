// Simple Express server to handle API routes during development
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev')); // Logging
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Handle Contact Form API
app.use('/api/contact', require('./api/contact'));

// Handle Admission Form API
app.use('/api/admission/test', require('./api/admission/test'));

// Handle MongoDB Test API
app.use('/api/mongo-test', require('./api/mongo-test'));

// Proxy frontend requests to Vite dev server
app.use('/', createProxyMiddleware({
  target: 'http://localhost:5174',
  changeOrigin: true,
  ws: true,
}));

// Start server
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/contact');
  console.log('- POST /api/admission/test');
  console.log('- POST /api/mongo-test');
}); 