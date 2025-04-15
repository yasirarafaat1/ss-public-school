import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Only allow POST method for custom connection strings
  if (req.method === 'POST') {
    return testCustomConnection(req, res);
  } 
  
  // Default GET method tests the env connection string
  return testDefaultConnection(req, res);
}

async function testCustomConnection(req, res) {
  // Get connection string from request body
  const { connectionString } = req.body;
  
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
      await client.close();
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
      await client.close();
    }
  }
}

// Helper function to sanitize connection string (hide passwords)
function sanitizeConnectionString(str) {
  if (!str) return 'undefined';
  
  try {
    // If it contains username:password, hide the password
    return str.replace(/(mongodb:\/\/[^:]+:)([^@]+)(@.+)/i, '$1*****$3');
  } catch (e) {
    return str;
  }
}

// Generate helpful tips based on the error
function generateTipsFromError(error, connectionString) {
  const tips = [];
  
  if (error.name === 'MongoServerSelectionError') {
    tips.push('MongoDB server selection failed. Check if MongoDB is running and accessible.');
    tips.push('Verify the hostname and port in your connection string.');
    
    if (connectionString.includes('localhost')) {
      tips.push('Try using 127.0.0.1 instead of localhost.');
      tips.push('Check if MongoDB is installed and running on your local machine.');
    }
  }
  
  if (error.message.includes('timed out')) {
    tips.push('Connection timed out. Check network connectivity and firewall settings.');
    tips.push('If using MongoDB Atlas, ensure your IP is whitelisted.');
  }
  
  if (error.message.includes('authentication failed')) {
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