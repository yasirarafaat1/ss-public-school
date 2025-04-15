// Simple MongoDB connection test script
const { MongoClient } = require('mongodb');

async function testMongoDB() {
  console.log('Starting MongoDB connection test...');
  
  try {
    // Get connection string from environment or use default
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schooldb';
    console.log('Using connection string:', uri);
    
    // Configure client options
    const options = {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      directConnection: true
    };
    
    // Create MongoDB client
    console.log('Creating MongoDB client...');
    const client = new MongoClient(uri, options);
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // Get server info
    const admin = client.db().admin();
    const serverInfo = await admin.serverInfo();
    console.log('Server info:', serverInfo);
    
    // Get available databases
    const dbList = await admin.listDatabases();
    console.log('Available databases:');
    dbList.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
    // Close connection
    await client.close();
    console.log('Connection closed');
    
    console.log('✅ MongoDB connection test completed successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
    
    // Provide helpful troubleshooting tips
    if (error.name === 'MongoServerSelectionError') {
      console.log('\nTroubleshooting tips:');
      console.log('1. Make sure MongoDB is running on your machine');
      console.log('2. Check if the MongoDB port (default 27017) is open and accessible');
      console.log('3. Try using 127.0.0.1 instead of localhost');
      console.log('4. If using authentication, make sure credentials are correct');
    }
    
    return false;
  }
}

// Run the test
testMongoDB().then(success => {
  process.exit(success ? 0 : 1);
}); 