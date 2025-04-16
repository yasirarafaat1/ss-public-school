// Admission Form API Diagnosis Tool
// This tool helps diagnose issues with the Admission form submission
require('dotenv').config();
const axios = require('axios');
const { MongoClient } = require('mongodb');

// Sample test data
const testData = {
  studentName: 'Test Student',
  parentName: 'Test Parent',
  email: 'test@example.com',
  phone: '1234567890',
  classInterested: 'Class 5',
  message: 'This is a test submission from the diagnostic tool.'
};

// Function to test direct MongoDB connection
async function testMongoDBConnection() {
  console.log('\n--- Testing MongoDB Connection ---');
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ ERROR: MONGODB_URI environment variable not found');
    console.log('   Please check your .env file and ensure it has a valid MONGODB_URI');
    return false;
  }
  
  // Sanitize connection string for logging
  const sanitizedUri = uri.replace(/(mongodb(\+srv)?:\/\/[^:]+:)([^@]+)(@.+)/i, '$1*****$4');
  console.log(`Using connection string: ${sanitizedUri}`);
  
  let client;
  try {
    client = new MongoClient(uri, {
      connectTimeoutMS: 15000,
      socketTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000,
    });
    
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // Get server info
    const serverInfo = await client.db().admin().serverInfo();
    console.log(`MongoDB version: ${serverInfo.version}`);
    
    // Try to write a test document
    const db = client.db();
    const testCollection = db.collection('admission_test');
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Diagnostic test document'
    };
    
    const result = await testCollection.insertOne(testDoc);
    console.log(`✅ Successfully wrote test document: ${result.insertedId}`);
    
    // Clean up the test document
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('✅ Successfully deleted test document');
    
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    
    // Provide specific guidance based on error type
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('\n‼️ AUTHENTICATION ERROR DETECTED ‼️');
      console.error('The username or password in your MongoDB connection string is incorrect.');
      console.error('Please verify your MongoDB Atlas credentials and update your .env file.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('\n‼️ CONNECTION REFUSED ERROR DETECTED ‼️');
      console.error('Your MongoDB server is not running or not accessible at the specified address.');
      console.error('If using local MongoDB, ensure the MongoDB service is running.');
      console.error('If using Atlas, ensure your IP address is whitelisted in the MongoDB Atlas Network Access settings.');
    }
    
    return false;
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Function to test the API endpoint
async function testAdmissionEndpoint() {
  console.log('\n--- Testing Admission API Endpoint ---');
  
  try {
    const endpoint = 'http://localhost:3000/api/admission/test';
    console.log(`Sending test request to: ${endpoint}`);
    console.log('Test data:', testData);
    
    const startTime = Date.now();
    const response = await axios.post(endpoint, testData, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const duration = Date.now() - startTime;
    
    console.log(`✅ API responded in ${duration}ms with status ${response.status}`);
    console.log('Response data:', response.data);
    
    return true;
  } catch (error) {
    console.error('❌ API request failed');
    
    if (error.code === 'ECONNABORTED') {
      console.error('   Request timed out. The API endpoint is taking too long to respond.');
      console.error('   This may indicate a slow database connection or server processing.');
    } else if (error.response) {
      // The request was made and the server responded with a status code
      console.error(`   Status: ${error.response.status}`);
      console.error('   Response:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('   No response received from server. The API may not be running.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`   Error setting up request: ${error.message}`);
    }
    
    return false;
  }
}

// Main diagnostic function
async function runDiagnostics() {
  console.log('====================================');
  console.log('ADMISSION FORM SUBMISSION DIAGNOSTICS');
  console.log('====================================');
  
  // Test MongoDB connection first
  const mongoSuccess = await testMongoDBConnection();
  
  // Then test the API endpoint
  const apiSuccess = await testAdmissionEndpoint();
  
  // Report summary
  console.log('\n--- Diagnostics Summary ---');
  console.log(`MongoDB Connection: ${mongoSuccess ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`API Endpoint Test: ${apiSuccess ? '✅ PASSED' : '❌ FAILED'}`);
  
  // Overall recommendation
  console.log('\n--- Recommendations ---');
  if (!mongoSuccess) {
    console.log('1. Fix your MongoDB connection issues first.');
    console.log('   • Check the connection string in your .env file');
    console.log('   • Verify credentials (username/password)');
    console.log('   • Ensure your IP is whitelisted in MongoDB Atlas');
    console.log('   • If using local MongoDB, ensure it\'s running');
  }
  
  if (!apiSuccess) {
    console.log(`${mongoSuccess ? '1' : '2'}. Check your API server:`);
    console.log('   • Ensure the API server is running (npm run api)');
    console.log('   • Check server logs for error messages');
    console.log('   • Verify the correct port is being used (default: 3000)');
  }
  
  if (mongoSuccess && apiSuccess) {
    console.log('✅ All tests passed! The system appears to be working correctly.');
    console.log('If you\'re still experiencing issues, check:');
    console.log('   • Frontend API calls configurations');
    console.log('   • Network connectivity issues between frontend and API');
    console.log('   • Browser console for any JavaScript errors');
  }
}

// Run the diagnostics
runDiagnostics().catch(console.error); 