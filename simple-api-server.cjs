// Simple Express API server for testing forms
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/schooldb';
const dbName = MONGODB_URI.split('/').pop()?.split('?')[0] || 'schooldb';

// Get MongoDB client
async function getMongoClient() {
  const client = new MongoClient(MONGODB_URI, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
    directConnection: true
  });
  
  await client.connect();
  return client;
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  console.log('Received contact form submission:', req.body);
  
  let client = null;
  
  try {
    // Validate input
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(200).json({
        success: false,
        message: 'All fields are required',
        missingFields: [
          !name && 'name',
          !email && 'email',
          !subject && 'subject',
          !message && 'message'
        ].filter(Boolean)
      });
    }
    
    // Connect to MongoDB
    client = await getMongoClient();
    const db = client.db(dbName);
    const collection = db.collection('contacts');
    
    // Create document
    const contactDocument = {
      name,
      email,
      phone,
      subject,
      message,
      createdAt: new Date(),
      status: 'new'
    };
    
    // Save to database
    const result = await collection.insertOne(contactDocument);
    console.log('Contact form saved to database:', result);
    
    // Return success
    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      id: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Error in contact API:', error);
    
    return res.status(200).json({
      success: false,
      message: 'Failed to save your message',
      error: error.message
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
});

// Admission test endpoint
app.post('/api/admission/test', async (req, res) => {
  console.log('Received admission inquiry:', req.body);
  
  let client = null;
  
  try {
    // Validate input
    const { studentName, parentName, email, phone, classInterested, message } = req.body;
    
    if (!studentName || !parentName || !email || !phone || !classInterested) {
      return res.status(200).json({
        success: false,
        message: 'Required fields are missing',
        missingFields: [
          !studentName && 'studentName',
          !parentName && 'parentName',
          !email && 'email',
          !phone && 'phone',
          !classInterested && 'classInterested'
        ].filter(Boolean)
      });
    }
    
    // Connect to MongoDB
    client = await getMongoClient();
    const db = client.db(dbName);
    const collection = db.collection('admissions');
    
    // Create document
    const admissionDocument = {
      studentName,
      parentName,
      email,
      phone,
      classInterested,
      message: message || '',
      createdAt: new Date(),
      status: 'pending'
    };
    
    // Save to database
    const result = await collection.insertOne(admissionDocument);
    console.log('Admission inquiry saved to database:', result);
    
    // Return success
    return res.status(200).json({
      success: true,
      message: 'Admission inquiry submitted successfully',
      id: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Error in admission API:', error);
    
    return res.status(200).json({
      success: false,
      message: 'Failed to save your admission inquiry',
      error: error.message
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
});

// MongoDB test endpoint
app.post('/api/mongo-test', async (req, res) => {
  console.log('Received MongoDB test request:', req.body);
  
  let client = null;
  
  try {
    // Get connection string from request or default
    const { connectionString } = req.body;
    const uri = connectionString || MONGODB_URI;
    
    // Connect to MongoDB
    client = new MongoClient(uri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000
    });
    
    await client.connect();
    
    // Get server info
    const admin = client.db().admin();
    const serverInfo = await admin.serverInfo();
    
    // Get available databases
    const dbList = await admin.listDatabases();
    const databases = dbList.databases.map(db => db.name);
    
    // Return success
    return res.status(200).json({
      success: true,
      message: 'Successfully connected to MongoDB',
      connectionString: uri.replace(/(mongodb:\/\/[^:]+:)([^@]+)(@.+)/i, '$1*****$3'),
      serverInfo,
      databases
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Generate helpful tips
    const tips = [];
    
    if (error.name === 'MongoServerSelectionError') {
      tips.push('MongoDB server selection failed. Check if MongoDB is running and accessible.');
      tips.push('Verify the hostname and port in your connection string.');
    }
    
    if (error.message && error.message.includes('timed out')) {
      tips.push('Connection timed out. Check network connectivity and firewall settings.');
    }
    
    if (error.message && error.message.includes('authentication failed')) {
      tips.push('Authentication failed. Verify your username and password.');
      tips.push('Make sure the database user has appropriate permissions.');
      tips.push('Try adding "?authSource=admin" to your connection string.');
    }
    
    // Add general tips if none specific
    if (tips.length === 0) {
      tips.push('Make sure MongoDB is installed and running.');
      tips.push('Check the connection string format.');
      tips.push('Ensure the MongoDB server is accessible from your network.');
    }
    
    return res.status(200).json({
      success: false,
      message: 'Failed to connect to MongoDB',
      connectionString: req.body.connectionString?.replace(/(mongodb:\/\/[^:]+:)([^@]+)(@.+)/i, '$1*****$3'),
      error: {
        name: error.name,
        message: error.message
      },
      tips
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/contact');
  console.log('- POST /api/admission/test');
  console.log('- POST /api/mongo-test');
}); 