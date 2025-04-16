// MongoDB connection test
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testMongoConnection() {
  console.log('Starting MongoDB connection test...');
  
  const uri = process.env.MONGODB_URI;
  console.log(`Using connection string from .env: ${uri ? 'Yes (found)' : 'No (not found)'}`);
  
  if (!uri) {
    console.error('❌ MONGODB_URI environment variable not found');
    return;
  }
  
  // Sanitize connection string for logging (hide credentials)
  const sanitizedUri = uri.replace(/(mongodb(\+srv)?:\/\/[^:]+:)([^@]+)(@.+)/i, '$1*****$4');
  console.log(`Connecting to MongoDB: ${sanitizedUri}`);
  
  let client;
  
  try {
    // Connect with optimized settings
    client = new MongoClient(uri, {
      connectTimeoutMS: 15000,
      socketTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000,
    });
    
    console.log('Connecting...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // Get server info
    const serverInfo = await client.db().admin().serverInfo();
    console.log('Server info:', serverInfo);
    
    // List databases
    const dbs = await client.db().admin().listDatabases();
    console.log('Available databases:');
    dbs.databases.forEach(db => console.log(`- ${db.name}`));
    
    console.log('✅ MongoDB connection test completed successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Error details:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Connection closed');
    }
  }
}

// Run the test
testMongoConnection().catch(console.error);