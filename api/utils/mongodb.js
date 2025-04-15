import { MongoClient } from 'mongodb';

// Connection URL - replace with your MongoDB connection string
// Use environment variable in production for security
const uri = process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@your-cluster.mongodb.net/schooldb?retryWrites=true&w=majority';

// Create a new MongoClient
const client = new MongoClient(uri);

// Database Name
const dbName = 'schooldb';

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    const db = client.db(dbName);
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
    throw new Error('Unable to connect to database');
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