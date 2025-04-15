// CommonJS version of the admission test API endpoint
const { connectToDatabase } = require('../utils/mongodb.cjs');

function handler(req, res) {
  // Set CORS headers directly on the response
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS method for preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method for actual requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Handle the request asynchronously
  handleAdmission(req, res).catch(error => {
    console.error('Unhandled error in admission API:', error);
    res.status(200).json({
      success: false,
      message: 'An unexpected error occurred',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  });
}

// Separate async function to handle the request
async function handleAdmission(req, res) {
  let dbClient = null;

  try {
    // Special handling for Vercel environment
    const isVercel = process.env.VERCEL === '1';
    console.log(`Running admission API in ${isVercel ? 'Vercel' : 'development'} environment`);
    
    // Debug: Log request headers and method
    console.log('Request method:', req.method);
    console.log('Content-Type:', req.headers['content-type']);
    
    // Log the request body safely
    try {
      console.log('Received admission form data:', 
        typeof req.body === 'object' ? JSON.stringify(req.body) : req.body);
    } catch (e) {
      console.log('Could not stringify admission form data:', e.message);
    }
    
    // Handle different content types and formats
    let formData;
    if (typeof req.body === 'string') {
      try {
        formData = JSON.parse(req.body);
      } catch (e) {
        console.error('Failed to parse JSON body:', e);
        // Try URL-encoded format
        formData = {};
        req.body.split('&').forEach(pair => {
          const [key, value] = pair.split('=');
          if (key && value) {
            formData[decodeURIComponent(key)] = decodeURIComponent(value);
          }
        });
      }
    } else {
      formData = req.body || {};
    }
    
    // Safely extract form data with defaults
    const studentName = formData?.studentName || '';
    const parentName = formData?.parentName || '';
    const email = formData?.email || '';
    const phone = formData?.phone || '';
    const classInterested = formData?.classInterested || '';
    const message = formData?.message || '';
    
    console.log('Parsed admission form data:', { 
      studentName, parentName, email, phone, classInterested, message 
    });
    
    // Validate input
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
    
    try {
      // Connect to the database
      console.log('Connecting to database for admission...');
      const { collections, client } = await connectToDatabase();
      console.log('Database connection successful');
      dbClient = client;
      
      // Verify collection is available
      if (!collections || !collections.admissions) {
        throw new Error('Admissions collection not available. Check database connection and schema.');
      }
      
      // Format the document to save
      const admissionDocument = {
        studentName,
        parentName,
        email,
        phone,
        classInterested,
        message: message || '',
        createdAt: new Date(),
        status: 'pending',
        // Add metadata for debugging
        metadata: {
          source: 'website_admission_form',
          userAgent: req.headers['user-agent'] || 'unknown',
          ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown',
          timestamp: new Date().toISOString()
        }
      };
      
      // Save to MongoDB
      console.log('Saving admission inquiry to database...');
      const result = await collections.admissions.insertOne(admissionDocument);
      console.log('Admission inquiry saved to database:', result);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Admission inquiry submitted successfully',
        id: result.insertedId ? result.insertedId.toString() : null
      });
    } catch (dbError) {
      console.error('Database operation error in admission API:', dbError);
      // Return a user-friendly error
      return res.status(200).json({
        success: false,
        message: 'Unable to save your admission inquiry. Please try again later.',
        error: isVercel ? dbError.name : dbError.message
      });
    }
  } catch (error) {
    console.error('Error in admission API:', error);
    return res.status(200).json({ 
      success: false,
      message: 'Failed to process your admission inquiry. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  } finally {
    // Close the database connection
    if (dbClient) {
      try {
        await dbClient.close();
        console.log('Database connection closed');
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
}

// Export for CommonJS
module.exports = handler; 