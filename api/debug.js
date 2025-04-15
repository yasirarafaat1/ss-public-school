export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Collect information about the request
  const requestInfo = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body || {},
    timestamp: new Date().toISOString(),
    serverInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      env: process.env.NODE_ENV || 'development'
    }
  };

  // Return debug information
  return res.status(200).json({
    message: 'Debug information',
    request: requestInfo,
    response: {
      headers: Object.fromEntries(
        Object.entries(res.getHeaders())
      )
    }
  });
} 