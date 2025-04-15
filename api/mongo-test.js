const { MongoClient } = require('mongodb');
require('dotenv').config();

// Get MongoDB connection string from environment variables or use default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/schooldb';

exports.handler = async (req, res) => {
  console.log('MongoDB connection test started');
  console.log(`Attempting to connect to: ${MONGODB_URI}`);
  
  let client;
  try {
    // Set connection options with helpful timeouts
    const options = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    };
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI, options);
    await client.connect();
    
    // Verify connection by getting server info
    const serverInfo = await client.db().admin().serverInfo();
    
    // Check database access
    const dbs = await client.db().admin().listDatabases();
    
    res.status(200).json({
      success: true,
      message: 'MongoDB connection successful',
      serverInfo,
      databases: dbs.databases.map(db => db.name),
      connectionString: MONGODB_URI.replace(/\/\/(.+?)@/, '//***:***@') // Hide credentials if any
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    
    // Provide detailed error info
    res.status(500).json({
      success: false,
      message: 'MongoDB connection failed',
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      connectionString: MONGODB_URI.replace(/\/\/(.+?)@/, '//***:***@'), // Hide credentials if any
      tips: [
        'Make sure MongoDB server is running',
        'Check network connectivity to MongoDB server',
        'Verify the connection string is correct',
        'Ensure MongoDB port is not blocked by firewall',
        'Check MongoDB server logs for errors'
      ]
    });
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}; 