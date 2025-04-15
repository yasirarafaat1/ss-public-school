// Simple Express API server for testing forms
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://sspublicschool.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug logging for environment
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/schooldb';
const dbName = MONGODB_URI.split('/').pop()?.split('?')[0] || 'schooldb';

// Connection cache for serverless environment
let cachedClient = null;
let cachedDb = null;

// Get MongoDB client with connection pooling for serverless
async function getMongoClient() {
  try {
    console.log('Requesting MongoDB connection...');
    
    // Use cached connection if available (important for Vercel serverless functions)
    if (cachedClient && cachedDb) {
      console.log('Using cached MongoDB connection');
      return { client: cachedClient, db: cachedDb };
    }
    
    // Create new connection with optimized options for serverless
    const client = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 20000,         // Increase connection timeout
      socketTimeoutMS: 20000,          // Increase socket timeout
      serverSelectionTimeoutMS: 20000, // Increase server selection timeout
      maxPoolSize: 10,                 // Limit connection pool for serverless
      minPoolSize: 1,                  // Keep at least one connection ready
      maxIdleTimeMS: 60000,            // Close idle connections after 60 seconds
      waitQueueTimeoutMS: 10000        // How long to wait for a connection from the pool
    });
    
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db(dbName);
    console.log('MongoDB connected successfully to database:', dbName);
    
    // Cache the connection
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Add a health check endpoint for Vercel
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  console.log('Received contact form submission:', req.body);
  
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
    const { db } = await getMongoClient();
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
  }
});

// Admission test endpoint
app.post('/api/admission/test', async (req, res) => {
  console.log('Received admission inquiry:', req.body);
  
  try {
    // Start timer for performance monitoring
    const startTime = Date.now();
    
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
    
    // Log connection attempt
    console.log('Connecting to MongoDB for admission inquiry...');
    
    // Connect to MongoDB
    const { db } = await getMongoClient();
    const collection = db.collection('admissions');
    
    // Log connection success
    console.log(`MongoDB connection successful (${Date.now() - startTime}ms)`);
    
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
    console.log('Saving admission inquiry...');
    const result = await collection.insertOne(admissionDocument);
    console.log(`Admission inquiry saved (${Date.now() - startTime}ms):`, result);
    
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
  }
});

// MongoDB test endpoint
app.post('/api/mongo-test', async (req, res) => {
  console.log('Received MongoDB test request:', req.body);
  
  try {
    // Get connection string from request or default
    const { connectionString } = req.body;
    const uri = connectionString || MONGODB_URI;
    
    // Connect to MongoDB
    const client = new MongoClient(uri, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000
    });
    
    await client.connect();
    
    // Get server info
    const admin = client.db().admin();
    const serverInfo = await admin.serverInfo();
    
    // Get available databases
    const dbList = await admin.listDatabases();
    const databases = dbList.databases.map(db => db.name);
    
    // Close this specific connection
    await client.close();
    
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
  }
});

// For Vercel serverless environment
if (process.env.VERCEL) {
  // Export app for Vercel serverless function
  module.exports = app;
} else {
  // Start server for local development
  app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('- POST /api/contact');
    console.log('- POST /api/admission/test');
    console.log('- POST /api/mongo-test');
    console.log('- GET /api/health');
  });
} 