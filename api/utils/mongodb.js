import { MongoClient } from 'mongodb';

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
let cachedCollections = null;

/**
 * Connect to MongoDB with connection pooling optimized for serverless
 * @returns {Promise<{client: MongoClient, db: Db, collections: Object}>}
 */
export async function connectToDatabase() {
  // Use cached connection if available
  if (cachedClient && cachedDb && cachedCollections) {
    console.log('Using cached MongoDB connection');
    try {
      // Test cached connection with ping
      await cachedDb.command({ ping: 1 });
      console.log('Cached connection is valid');
      return { 
        client: cachedClient, 
        db: cachedDb, 
        collections: cachedCollections 
      };
    } catch (pingError) {
      console.warn('Cached connection is stale, creating new connection');
      // Continue to create a new connection
    }
  }
  
  // Get MongoDB URI from environment variables
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not defined');
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // Print partial URI for debugging (hiding credentials)
  const sanitizedUri = uri.replace(/(mongodb(\+srv)?:\/\/[^:]+:)([^@]+)(@.+)/, '$1****$4');
  console.log(`Connecting to MongoDB: ${sanitizedUri}`);

  // Extract database name from the connection string
  const dbName = uri.split('/').pop()?.split('?')[0] || 'schooldb';
  console.log(`Database name extracted: ${dbName}`);

  try {
    // Connect with optimized settings for serverless functions
    const client = new MongoClient(uri, {
      connectTimeoutMS: 15000,
      socketTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000,
      maxPoolSize: 10, 
      minPoolSize: 1
    });

    console.log('Establishing MongoDB connection...');
    await client.connect();
    console.log('MongoDB connection established');
    
    const db = client.db(dbName);
    
    // Test connection with ping
    await db.command({ ping: 1 });
    console.log('MongoDB server ping successful');
    
    // Initialize collections
    const collections = {
      contacts: db.collection('contacts'),
      admissions: db.collection('admissions'),
      users: db.collection('users')
    };
    
    // Verify collections exist or create them
    console.log('Verifying collections...');
    const existingCollections = await db.listCollections().toArray();
    const existingNames = existingCollections.map(c => c.name);
    
    for (const [name, collection] of Object.entries(collections)) {
      if (!existingNames.includes(name)) {
        console.log(`Creating missing collection: ${name}`);
        await db.createCollection(name);
      }
    }
    
    // Cache the client, db and collections for reuse
    cachedClient = client;
    cachedDb = db;
    cachedCollections = collections;
    
    return { client, db, collections };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Provide more specific error messages based on error type
    if (error.name === 'MongoServerSelectionError') {
      throw new Error(`Cannot connect to MongoDB server: ${error.message}. Check if your IP is whitelisted.`);
    } else if (error.name === 'MongoNetworkError') {
      throw new Error(`Network error connecting to MongoDB: ${error.message}`);
    } else if (error.message && (
      error.message.includes('authentication failed') || 
      error.message.includes('bad auth') || 
      error.code === 8000 || 
      (error.errorResponse && error.errorResponse.code === 8000)
    )) {
      console.error('CRITICAL: MongoDB authentication failed. Please check your username and password in the connection string.');
      console.error('Details:', {
        code: error.code,
        codeName: error.codeName,
        errorResponse: error.errorResponse
      });
      throw new Error(`MongoDB authentication failed. Check your username and password. Error code: ${error.code || 'Unknown'}`);
    }
    
    throw error;
  }
}

/**
 * Close MongoDB connection
 */
export async function closeDatabaseConnection() {
  if (cachedClient) {
    try {
      await cachedClient.close();
      cachedClient = null;
      cachedDb = null;
      cachedCollections = null;
      console.log('MongoDB connection closed');
      return true;
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      return false;
    }
  }
  return true;
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