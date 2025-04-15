import { connectToDatabase } from './utils/mongodb';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let dbClient = null;

  try {
    // Log environment for debugging
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
      mongoUriStart: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) + '...' : 'not set'
    };
    
    console.log('Environment info:', envInfo);

    // Connect to the database
    console.log('Testing database connection...');
    const { db, client } = await connectToDatabase();
    dbClient = client;
    
    // Simple test query
    const collections = await db.listCollections().toArray();
    
    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      database: db.databaseName,
      collections: collections.map(c => c.name),
      environment: envInfo
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
  } finally {
    if (dbClient) {
      try {
        await dbClient.close();
        console.log('Database connection closed');
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
} 