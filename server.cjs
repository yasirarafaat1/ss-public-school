// Simple Express server to handle API routes during development
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev')); // Logging
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Define root path for better path resolution
const rootDir = path.resolve('.');
console.log('Root directory:', rootDir);

// Helper to get absolute path
function getAbsolutePath(relativePath) {
  const absolutePath = path.resolve(rootDir, relativePath);
  console.log(`Resolving ${relativePath} to ${absolutePath}`);
  return absolutePath;
}

// Custom import for CommonJS
function importAPI(filePath) {
  try {
    const resolvedPath = getAbsolutePath(filePath);
    if (fs.existsSync(resolvedPath)) {
      console.log(`Loading API module: ${resolvedPath}`);
      // Clear require cache to ensure fresh module
      delete require.cache[require.resolve(resolvedPath)];
      const module = require(resolvedPath);
      return module.default || module;
    } else {
      console.error(`API module not found: ${resolvedPath}`);
      return (req, res) => res.status(404).json({ 
        success: false, 
        error: `API endpoint not found: ${filePath} (resolved to ${resolvedPath})` 
      });
    }
  } catch (error) {
    console.error(`Error loading module ${filePath}:`, error);
    return (req, res) => res.status(500).json({ 
      success: false, 
      error: `Failed to load API endpoint: ${error.message}` 
    });
  }
}

// Direct API handlers - avoiding Express router since these are simple handlers
app.all('/api/contact', (req, res) => {
  try {
    const handler = importAPI('./api/contact.cjs');
    handler(req, res);
  } catch (error) {
    console.error('Error importing contact handler:', error);
    res.status(500).json({
      success: false,
      error: `Contact handler error: ${error.message}`
    });
  }
});

app.all('/api/admission/test', (req, res) => {
  try {
    const handler = importAPI('./api/admission/test.cjs');
    handler(req, res);
  } catch (error) {
    console.error('Error importing admission handler:', error);
    res.status(500).json({
      success: false,
      error: `Admission handler error: ${error.message}`
    });
  }
});

app.all('/api/mongo-test', (req, res) => {
  try {
    // For compatibility, first try .cjs then .js
    let handler;
    try {
      handler = importAPI('./api/mongo-test.cjs');
    } catch (e) {
      console.log('Falling back to .js extension for mongo-test');
      handler = importAPI('./api/mongo-test.js');
    }
    handler(req, res);
  } catch (error) {
    console.error('Error importing mongo-test handler:', error);
    res.status(500).json({
      success: false,
      error: `Mongo test handler error: ${error.message}`
    });
  }
});

// Catch-all handler for other API routes
app.all('/api/*', (req, res) => {
  console.log(`Unknown API route: ${req.path}`);
  res.status(404).json({ success: false, error: `API endpoint not found: ${req.path}` });
});

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