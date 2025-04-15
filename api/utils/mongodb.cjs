// CommonJS version of MongoDB utility
const { MongoClient } = require('mongodb');

// Connection URL - with fallback to localhost if not configured
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schooldb';

// Extract database name from URI or default to schooldb
let dbName;
try {
  // Handle different URI formats (mongodb:// vs mongodb+srv://)
  if (uri.includes('mongodb+srv://')) {
    // For Atlas URIs like: mongodb+srv://user:pass@cluster.mongodb.net/dbname
    const uriParts = uri.split('/');
    dbName = uriParts[uriParts.length - 1].split('?')[0] || 'schooldb';
  } else {
    // For standard URIs like: mongodb://localhost:27017/dbname
    dbName = uri.split('/').pop()?.split('?')[0] || 'schooldb';
  }
} catch (error) {
  console.error('Error parsing database name from URI:', error);
  dbName = 'schooldb'; // Default fallback
}

// Configure client options to handle different environments
const clientOptions = {
  connectTimeoutMS: 30000,        // Extended timeout for serverless environments
  socketTimeoutMS: 45000,         // Longer socket timeout
};

// For local development, might need specific options
if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
  // Direct connection for local MongoDB
  clientOptions.directConnection = true;
  
  // If authentication is used but no authSource is specified, default to admin
  if (uri.includes('@') && !uri.includes('authSource=')) {
    console.log('Local connection with authentication detected. Defaulting authSource to admin.');
    // Don't modify the URI directly as it might already have other query parameters
  }
}

// Check if we're running in a serverless environment
const isServerless = process.env.VERCEL === '1';
if (isServerless) {
  console.log('Running in Vercel serverless environment');
  // Optimize for serverless
  clientOptions.maxPoolSize = 1; // Reduce connection pool for serverless
  clientOptions.minPoolSize = 0;
}

// Safely log the connection string (hiding credentials)
try {
  console.log(`MongoDB connection string: ${sanitizeConnectionString(uri)}`);
} catch (e) {
  console.log('Could not log MongoDB connection string');
}

// Cache the client connection for serverless environments
let cachedClient = null;
let cachedDb = null;

// Connect to MongoDB with detailed error handling
async function connectToDatabase() {
  try {
    console.log('MongoDB connection info:');
    console.log('- Database name:', dbName);
    console.log('- Connection type:', uri.startsWith('mongodb+srv://') ? 'Atlas/Cloud' : 'Standard');
    console.log('- Local connection:', uri.includes('localhost') || uri.includes('127.0.0.1'));
    console.log('- Serverless environment:', isServerless);
    
    // Check if MongoDB URI is properly set
    if (!uri || uri === 'mongodb://localhost:27017/schooldb') {
      console.warn('Using default MongoDB connection. Make sure MongoDB is running locally.');
    }
    
    // Special handling for serverless environments to reuse connections
    if (isServerless && cachedClient && cachedDb) {
      console.log('Reusing cached MongoDB connection');
      // Test the cached connection is still alive
      try {
        await cachedDb.command({ ping: 1 });
        console.log('Cached connection is valid');
        
        return {
          db: cachedDb,
          client: cachedClient,
          collections: {
            contacts: cachedDb.collection('contacts'),
            admissions: cachedDb.collection('admissions')
          }
        };
      } catch (pingError) {
        console.warn('Cached connection failed, creating new connection:', pingError.message);
        // Continue to create a new connection below
      }
    }
    
    // Try to connect to MongoDB
    console.log('Connecting to MongoDB...');
    
    // Create a fresh client for this connection
    const client = new MongoClient(uri, clientOptions);
    await client.connect();
    console.log('Successfully connected to MongoDB');
    
    const db = client.db(dbName);
    
    // Test connection with ping command
    try {
      const pingResult = await db.command({ ping: 1 });
      console.log('MongoDB server ping successful:', pingResult);
    } catch (pingError) {
      console.error('MongoDB ping failed:', pingError.message);
      throw new Error(`Connected to MongoDB but ping failed: ${pingError.message}`);
    }
    
    // Cache the connection for serverless
    if (isServerless) {
      cachedClient = client;
      cachedDb = db;
      console.log('Cached new MongoDB connection for future use');
    }
    
    return {
      db,
      client,
      collections: {
        contacts: db.collection('contacts'),
        admissions: db.collection('admissions')
      }
    };
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    
    // Create a detailed error for the client based on error type
    let errorMessage = 'Database connection failed';
    let errorDetails = '';
    
    if (err.name === 'MongoServerSelectionError') {
      errorMessage = 'Cannot reach MongoDB server. Please check if MongoDB is running locally or if your connection string is correct.';
      if (uri.includes('@') && !uri.includes('authSource=')) {
        errorDetails = 'Auth source may be missing. Try adding "?authSource=admin" to your connection string.';
      }
    } else if (err.name === 'MongoNetworkError') {
      errorMessage = 'Network error connecting to MongoDB. Check your internet connection and firewall settings.';
    } else if (err.name === 'MongoParseError') {
      errorMessage = 'Invalid MongoDB connection string format. Please check your MONGODB_URI in .env file.';
    } else if (err.name === 'MongoNotConnectedError') {
      errorMessage = 'Not connected to MongoDB. Ensure MongoDB service is running.';
    } else if (err.message && err.message.includes('Authentication failed')) {
      errorMessage = 'MongoDB authentication failed. Check your username and password in connection string.';
      errorDetails = 'Make sure you have specified the correct authSource (usually admin) in your connection string.';
    } else if (err.message && err.message.includes('ECONNREFUSED')) {
      errorMessage = 'MongoDB connection refused. Make sure MongoDB is running on the specified host and port.';
    }
    
    // Create a helpful error with detailed instructions
    throw new Error(`${errorMessage} ${errorDetails ? '| ' + errorDetails : ''} | Original error: ${err.message}`);
  }
}

// Helper function to close the database connection
async function closeDatabaseConnection() {
  // In serverless environments, we want to keep connections alive
  if (isServerless) {
    console.log('Keeping MongoDB connection alive for serverless environment');
    return true;
  }
  
  try {
    if (cachedClient) {
      await cachedClient.close();
      cachedClient = null;
      cachedDb = null;
      console.log('MongoDB connection closed');
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    return false;
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

// Export functions for CommonJS
module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
  sanitizeConnectionString
}; 