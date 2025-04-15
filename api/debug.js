// Debug API endpoint for MongoDB connection testing
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const startTime = Date.now();
    console.log('Debug endpoint: Testing MongoDB connection...');
    
    // Get MongoDB URI from environment variables
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/schooldb';
    const hiddenUri = MONGODB_URI.replace(/(mongodb:\/\/[^:]+:)([^@]+)(@.+)/i, '$1*****$3');
    
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000
    });
    
    // Try to connect
    console.log('Attempting connection...');
    await client.connect();
    
    // Get basic server info
    const admin = client.db().admin();
    const serverInfo = await admin.serverStatus();
    const connectionTime = Date.now() - startTime;
    
    // Close connection
    await client.close();
    
    return res.status(200).json({
      success: true,
      message: 'MongoDB connection successful',
      connectionTime: `${connectionTime}ms`,
      environment: {
        vercel: !!process.env.VERCEL,
        region: process.env.VERCEL_REGION || 'unknown',
        nodeEnv: process.env.NODE_ENV || 'development'
      },
      mongodb: {
        version: serverInfo.version,
        connections: serverInfo.connections.current,
        uptime: serverInfo.uptime
      }
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    return res.status(200).json({
      success: false,
      message: 'MongoDB connection failed',
      error: {
        name: error.name,
        message: error.message,
        code: error.code
      },
      environment: {
        vercel: !!process.env.VERCEL,
        region: process.env.VERCEL_REGION || 'unknown',
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    });
  }
}; 