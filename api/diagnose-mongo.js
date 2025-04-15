// Advanced MongoDB diagnostic endpoint
// Use this to get detailed information about your MongoDB connection issues

import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const diagnosticResults = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV || 'not set',
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriStart: process.env.MONGODB_URI 
        ? `${process.env.MONGODB_URI.substring(0, 15)}...` 
        : 'not set',
      isLocalhost: process.env.MONGODB_URI?.includes('localhost') || false
    },
    tests: {},
    possibleIssues: [],
    recommendations: []
  };

  // Test 1: Parse the connection string
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schooldb';
    diagnosticResults.tests.connectionString = {
      success: true,
      uri: uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'), // Hide credentials
      isAtlasUri: uri.startsWith('mongodb+srv://'),
      isLocalUri: uri.includes('localhost') || uri.includes('127.0.0.1'),
      hasDatabase: uri.split('/').length > 3 || uri.includes('mongodb+srv://'),
      format: 'valid'
    };
    
    // Extract database name from URI
    let dbName;
    if (uri.includes('mongodb+srv://')) {
      const uriParts = uri.split('/');
      dbName = uriParts[uriParts.length - 1]?.split('?')[0];
    } else {
      dbName = uri.split('/').pop()?.split('?')[0];
    }
    
    diagnosticResults.tests.connectionString.dbName = dbName || 'none';
    
    if (!dbName) {
      diagnosticResults.possibleIssues.push(
        'No database name found in connection string'
      );
      diagnosticResults.recommendations.push(
        'Add a database name to your connection string (e.g., /schooldb at the end)'
      );
    }
  } catch (error) {
    diagnosticResults.tests.connectionString = {
      success: false,
      error: error.message,
      format: 'invalid'
    };
    
    diagnosticResults.possibleIssues.push(
      'Invalid MongoDB connection string format'
    );
    diagnosticResults.recommendations.push(
      'Check your connection string format in the .env file'
    );
  }

  // Test 2: Try to connect with minimal timeout (quick check)
  const quickConnectOptions = {
    connectTimeoutMS: 5000,
    socketTimeoutMS: 5000
  };
  
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schooldb';
    const client = new MongoClient(uri, quickConnectOptions);
    
    const connectStart = Date.now();
    await client.connect();
    const connectTime = Date.now() - connectStart;
    
    diagnosticResults.tests.quickConnect = {
      success: true,
      connectionTimeMs: connectTime
    };
    
    // Test ping
    try {
      const db = client.db();
      const pingStart = Date.now();
      await db.command({ ping: 1 });
      const pingTime = Date.now() - pingStart;
      
      diagnosticResults.tests.quickConnect.pingSuccess = true;
      diagnosticResults.tests.quickConnect.pingTimeMs = pingTime;
    } catch (pingError) {
      diagnosticResults.tests.quickConnect.pingSuccess = false;
      diagnosticResults.tests.quickConnect.pingError = pingError.message;
      
      diagnosticResults.possibleIssues.push(
        'Connected to MongoDB server but ping failed'
      );
      diagnosticResults.recommendations.push(
        'Check if MongoDB server has any restrictions or firewall rules'
      );
    }
    
    await client.close();
  } catch (error) {
    diagnosticResults.tests.quickConnect = {
      success: false,
      error: error.message,
      errorName: error.name,
      errorCode: error.code
    };
    
    // Add specific recommendations based on error type
    if (error.name === 'MongoServerSelectionError') {
      diagnosticResults.possibleIssues.push(
        'Cannot reach MongoDB server'
      );
      
      if (diagnosticResults.tests.connectionString?.isLocalUri) {
        diagnosticResults.recommendations.push(
          'Check if MongoDB is running locally with mongod command'
        );
      } else {
        diagnosticResults.recommendations.push(
          'Check internet connection and MongoDB Atlas status'
        );
      }
    } else if (error.name === 'MongoNetworkError') {
      diagnosticResults.possibleIssues.push(
        'Network error connecting to MongoDB'
      );
      diagnosticResults.recommendations.push(
        'Check your internet connection and firewall settings'
      );
    } else if (error.message?.includes('Authentication failed')) {
      diagnosticResults.possibleIssues.push(
        'MongoDB authentication failed'
      );
      diagnosticResults.recommendations.push(
        'Check your username and password in the connection string'
      );
    }
  }

  // Test 3: Check MongoDB port availability (if local)
  if (diagnosticResults.environment.isLocalhost) {
    try {
      const isPortOpen = await new Promise((resolve) => {
        const socket = new (require('net').Socket)();
        
        socket.setTimeout(1000);
        socket.on('connect', () => {
          socket.destroy();
          resolve(true);
        });
        
        socket.on('timeout', () => {
          socket.destroy();
          resolve(false);
        });
        
        socket.on('error', () => {
          resolve(false);
        });
        
        socket.connect(27017, '127.0.0.1');
      });
      
      diagnosticResults.tests.localPort = {
        success: isPortOpen,
        port: 27017
      };
      
      if (!isPortOpen) {
        diagnosticResults.possibleIssues.push(
          'MongoDB is not running on default port 27017'
        );
        diagnosticResults.recommendations.push(
          'Start MongoDB server with mongod command'
        );
      }
    } catch (error) {
      diagnosticResults.tests.localPort = {
        success: false,
        error: error.message
      };
    }
  }

  // Generate final recommendations
  if (diagnosticResults.possibleIssues.length === 0) {
    diagnosticResults.recommendations.push(
      "No obvious issues detected. Try using the fallback api/contact-safe.js endpoint"
    );
  }
  
  // If still having issues
  diagnosticResults.recommendations.push(
    "Try using the fallback api/contact-safe.js endpoint while troubleshooting"
  );
  diagnosticResults.recommendations.push(
    "Consider using MongoDB Atlas instead of local MongoDB"
  );

  // Return all diagnostic results
  return res.status(200).json(diagnosticResults);
} 