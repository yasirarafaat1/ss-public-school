// Debug endpoint for MongoDB connection
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  // Allow only GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Get environment variables and config
  const environment = {
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    region: process.env.VERCEL_REGION,
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriStart: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'Not set'
  };
  
  try {
    console.log('Testing MongoDB connection...');
    // Get the connection string from environment variables
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      return res.status(200).json({
        success: false,
        message: 'MONGODB_URI environment variable is not set',
        environment
      });
    }
    
    // Create client with generous timeouts
    const client = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 15000,
      socketTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000
    });
    
    // Try to connect
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Get database name from URI
    const dbName = MONGODB_URI.split('/').pop()?.split('?')[0] || 'schooldb';
    const db = client.db(dbName);
    
    // Check if collections exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Check collections we need
    const requiredCollections = ['contacts', 'admissions', 'users'];
    const missingCollections = requiredCollections.filter(c => !collectionNames.includes(c));
    
    // Create missing collections if needed
    if (missingCollections.length > 0) {
      console.log(`Creating missing collections: ${missingCollections.join(', ')}`);
      for (const collection of missingCollections) {
        await db.createCollection(collection);
      }
    }
    
    // Get connection status
    const admin = client.db().admin();
    const serverStatus = await admin.serverStatus();
    
    // Clean up connection
    await client.close();
    
    // Return success with helpful info
    return res.status(200).json({
      success: true,
      message: 'MongoDB connection successful',
      environment,
      database: {
        name: dbName,
        collections: collectionNames,
        missingCollections: missingCollections.length > 0 ? missingCollections : null,
        created: missingCollections.length > 0
      },
      server: {
        version: serverStatus.version,
        uptime: serverStatus.uptime,
        connections: serverStatus.connections.current
      }
    });
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Return detailed error information
    return res.status(200).json({
      success: false,
      message: 'MongoDB connection failed',
      error: {
        name: error.name,
        message: error.message,
        code: error.code
      },
      environment
    });
  }
} 