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

  // Return status for GET and POST
  if (req.method === 'GET' || req.method === 'POST') {
    return res.status(200).json({ 
      success: true,
      message: 'CORS is working',
      method: req.method,
      time: new Date().toISOString()
    });
  }

  // Otherwise return method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
} 