import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Set CORS headers to allow access from browser
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Only allow POST method for custom connection strings
    if (req.method === 'POST') {
      return await testCustomConnection(req, res);
    } 
    
    // Default GET method tests the env connection string
    return await testDefaultConnection(req, res);
  } catch (error) {
    console.error('Unhandled error in MongoDB test API:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred in the API endpoint',
      error: {
        name: error.name || 'UnknownError',
        message: error.message || 'No error message available',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
}

async function testCustomConnection(req, res) {
  // Get connection string from request body
  const { connectionString } = req.body || {};
  
  if (!connectionString) {
    return res.status(400).json({
      success: false,
      message: 'Connection string is required',
      tips: ['Provide a valid MongoDB connection string in the request body']
    });
  }
  
  let client;
  try {
    // Set options for quick timeout 
    const options = {
      connectTimeoutMS: 5000,  // 5 seconds connection timeout
      serverSelectionTimeoutMS: 5000, // 5 seconds server selection timeout
    };
    
    // Attempt connection
    client = new MongoClient(connectionString, options);
    await client.connect();
    
    // Get server info
    const admin = client.db().admin();
    const serverInfo = await admin.serverInfo();
    
    // Get available databases
    const dbs = await admin.listDatabases();
    const databases = dbs.databases.map(db => db.name);
    
    return res.status(200).json({
      success: true,
      message: 'Successfully connected to MongoDB',
      connectionString: sanitizeConnectionString(connectionString),
      serverInfo,
      databases
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Generate helpful tips based on error
    const tips = generateTipsFromError(error, connectionString);
    
    return res.status(200).json({
      success: false,
      message: 'Failed to connect to MongoDB',
      connectionString: sanitizeConnectionString(connectionString),
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      tips
    });
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (err) {
        console.error('Error closing MongoDB client:', err);
      }
    }
  }
}

async function testDefaultConnection(req, res) {
  // Get the connection string from environment variable
  const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/schooldb';
  let client;
  
  try {
    // Attempt connection
    client = new MongoClient(connectionString, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    
    await client.connect();
    
    // Get server info
    const admin = client.db().admin();
    const serverInfo = await admin.serverInfo();
    
    // Get available databases
    const dbs = await admin.listDatabases();
    const databases = dbs.databases.map(db => db.name);
    
    return res.status(200).json({
      success: true,
      message: 'Successfully connected to MongoDB',
      connectionString: sanitizeConnectionString(connectionString),
      serverInfo,
      databases
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Generate helpful tips based on error
    const tips = generateTipsFromError(error, connectionString);
    
    return res.status(200).json({
      success: false,
      message: 'Failed to connect to MongoDB',
      connectionString: sanitizeConnectionString(connectionString),
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      tips
    });
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (err) {
        console.error('Error closing MongoDB client:', err);
      }
    }
  }
}

// Helper function to sanitize connection string (hide passwords)
function sanitizeConnectionString(str) {
  if (!str) return 'undefined';
  
  try {
    // If it contains username:password, hide the password
    return str.replace(/(mongodb:\/\/[^:]+:)([^@]+)(@.+)/i, '$1*****$3')
              .replace(/(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.+)/i, '$1*****$3');
  } catch (e) {
    return str;
  }
}

// Generate helpful tips based on the error
function generateTipsFromError(error, connectionString) {
  const tips = [];
  
  if (!error) {
    return ['An unknown error occurred during connection.'];
  }
  
  if (error.name === 'MongoServerSelectionError') {
    tips.push('MongoDB server selection failed. Check if MongoDB is running and accessible.');
    tips.push('Verify the hostname and port in your connection string.');
    
    if (connectionString && connectionString.includes('localhost')) {
      tips.push('Try using 127.0.0.1 instead of localhost.');
      tips.push('Check if MongoDB is installed and running on your local machine.');
    }
  }
  
  if (error.message && error.message.includes('timed out')) {
    tips.push('Connection timed out. Check network connectivity and firewall settings.');
    tips.push('If using MongoDB Atlas, ensure your IP is whitelisted.');
  }
  
  if (error.message && error.message.includes('authentication failed')) {
    tips.push('Authentication failed. Verify your username and password.');
    tips.push('Make sure the database user has appropriate permissions.');
  }
  
  if (error.code === 'ENOTFOUND') {
    tips.push('Hostname not found. Verify the hostname in your connection string.');
    tips.push('Check your network configuration and DNS settings.');
  }
  
  if (error.code === 'ECONNREFUSED') {
    tips.push('Connection refused. Verify MongoDB is running on the specified port.');
    tips.push('Check if a firewall is blocking the connection.');
  }
  
  // Add some general tips if none specific were added
  if (tips.length === 0) {
    tips.push('Make sure MongoDB is installed and running.');
    tips.push('Try adding "?directConnection=true" to your connection string.');
    tips.push('Check network connectivity between your app and MongoDB.');
  }
  
  return tips;
}