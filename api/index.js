// Vercel API handler
const app = require('../simple-api-server.cjs');

// Export a function that handles requests
module.exports = (req, res) => {
  // Log request details for debugging
  console.log('Vercel API request:', {
    method: req.method,
    url: req.url,
    headers: {
      'content-type': req.headers['content-type'],
      'origin': req.headers['origin'],
      'user-agent': req.headers['user-agent']
    }
  });
  
  // Pass request to the Express app
  return app(req, res);
}; 