import { MongoClient } from 'mongodb';

// Connection URL - replace with your MongoDB connection string
// Use environment variable in production for security
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schooldb';

// Create a new MongoClient with more detailed settings
const client = new MongoClient(uri, {
  connectTimeoutMS: 5000, // 5 seconds timeout for connection
  socketTimeoutMS: 30000, // 30 seconds timeout for operations
  retryWrites: true,
  w: 'majority'
});

// Database Name - extract from URI or default to schooldb
const dbName = uri.split('/').pop()?.split('?')[0] || 'schooldb';

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    // Add detailed debug info
    console.log('Attempting to connect to MongoDB...');
    console.log('Database name:', dbName);
    console.log('Connection string type:', uri.startsWith('mongodb+srv') ? 'Atlas' : 'Standard');
    
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    const db = client.db(dbName);
    
    // Verify connection by testing a simple command
    const stats = await db.command({ ping: 1 });
    console.log('Database ping successful:', stats);
    
    return {
      db,
      client,
      // Return common collections
      collections: {
        contacts: db.collection('contacts'),
        admissions: db.collection('admissions')
      }
    };
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    
    // More specific error message based on the error type
    if (err.name === 'MongoServerSelectionError') {
      throw new Error(`Unable to connect to MongoDB server: ${err.message}. Please check your connection string and network.`);
    } else if (err.name === 'MongoParseError') {
      throw new Error(`Invalid MongoDB connection string: ${err.message}. Please check your MONGODB_URI.`);
    } else {
      throw new Error(`Database connection error: ${err.message}`);
    }
  }
}

// Helper function to close the database connection when done
export async function closeDatabaseConnection() {
  try {
    await client.close();
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
  }
} 