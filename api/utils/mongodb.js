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
  connectTimeoutMS: 10000,    // Longer timeout for cloud connections
  socketTimeoutMS: 45000,     // Longer socket timeout
  retryWrites: true,
  w: 'majority',
  useNewUrlParser: true,      // Handle older MongoDB versions
  useUnifiedTopology: true    // Use modern connection management
};

// For local development, might need to disable some security options
if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
  clientOptions.ssl = false;
  clientOptions.directConnection = true;
}

// Create MongoDB client
const client = new MongoClient(uri, clientOptions);

// Connect to MongoDB with detailed error handling
export async function connectToDatabase() {
  try {
    console.log('MongoDB connection info:');
    console.log('- Database name:', dbName);
    console.log('- Connection type:', uri.startsWith('mongodb+srv://') ? 'Atlas/Cloud' : 'Standard');
    console.log('- Local connection:', uri.includes('localhost') || uri.includes('127.0.0.1'));
    
    // Check if MongoDB URI is properly set
    if (!uri || uri === 'mongodb://localhost:27017/schooldb') {
      console.warn('Using default MongoDB connection. Make sure MongoDB is running locally.');
    }
    
    // Try to connect to MongoDB
    console.log('Connecting to MongoDB...');
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
    
    if (err.name === 'MongoServerSelectionError') {
      errorMessage = 'Cannot reach MongoDB server. Please check if MongoDB is running locally or if your connection string is correct.';
    } else if (err.name === 'MongoNetworkError') {
      errorMessage = 'Network error connecting to MongoDB. Check your internet connection and firewall settings.';
    } else if (err.name === 'MongoParseError') {
      errorMessage = 'Invalid MongoDB connection string format. Please check your MONGODB_URI in .env file.';
    } else if (err.name === 'MongoNotConnectedError') {
      errorMessage = 'Not connected to MongoDB. Ensure MongoDB service is running.';
    } else if (err.message && err.message.includes('Authentication failed')) {
      errorMessage = 'MongoDB authentication failed. Check your username and password in connection string.';
    } else if (err.message && err.message.includes('ECONNREFUSED')) {
      errorMessage = 'MongoDB connection refused. Make sure MongoDB is running on the specified host and port.';
    }
    
    // Create a helpful error with detailed instructions
    throw new Error(`${errorMessage} | Original error: ${err.message}`);
  }
}

// Helper function to close the database connection
export async function closeDatabaseConnection() {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    return true;
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    return false;
  }
} 