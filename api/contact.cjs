// CommonJS version of the contact API endpoint
const { connectToDatabase } = require('./utils/mongodb.cjs');

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
  handleContact(req, res).catch(error => {
    console.error('Unhandled error in contact API:', error);
    res.status(200).json({
      success: false,
      message: 'An unexpected error occurred',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  });
}

// Separate async function to handle the request
async function handleContact(req, res) {
  let dbClient = null;

  try {
    // Special handling for Vercel environment
    const isVercel = process.env.VERCEL === '1';
    console.log(`Running in ${isVercel ? 'Vercel' : 'development'} environment`);
    
    // Debug: Log request headers and method
    console.log('Request method:', req.method);
    console.log('Content-Type:', req.headers['content-type']);
    
    // Log the request body safely
    try {
      console.log('Received contact form data:', 
        typeof req.body === 'object' ? JSON.stringify(req.body) : req.body);
    } catch (e) {
      console.log('Could not stringify request body:', e.message);
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
    
    // Safely extract form data with defaults to prevent undefined errors
    const name = formData?.name || '';
    const email = formData?.email || '';
    const phone = formData?.phone || '';
    const subject = formData?.subject || '';
    const message = formData?.message || '';
    
    console.log('Parsed form data:', { name, email, phone, subject, message });
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(200).json({ 
        success: false,
        message: 'All fields are required',
        missingFields: [
          !name && 'name',
          !email && 'email',
          !phone && 'phone',
          !subject && 'subject',
          !message && 'message'
        ].filter(Boolean)
      });
    }
    
    try {
      // Connect to the database
      console.log('Connecting to database...');
      const { collections, client } = await connectToDatabase();
      console.log('Database connection successful');
      dbClient = client;
      
      // Format the document to save
      const contactDocument = {
        name,
        email,
        phone,
        subject,
        message,
        createdAt: new Date(),
        status: 'new',
        // Add metadata for debugging
        metadata: {
          source: 'website_contact_form',
          userAgent: req.headers['user-agent'] || 'unknown',
          ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown',
          timestamp: new Date().toISOString()
        }
      };
      
      // Verify collection is available
      if (!collections || !collections.contacts) {
        throw new Error('Contacts collection not available. Check database connection and schema.');
      }
      
      // Save to MongoDB
      console.log('Saving contact form to database...');
      const result = await collections.contacts.insertOne(contactDocument);
      console.log('Contact form saved to database:', result);
      
      // Return a successful response with minimal data
      return res.status(200).json({ 
        success: true, 
        message: 'Message sent successfully',
        id: result.insertedId ? result.insertedId.toString() : null
      });
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      // More specific error message for database operation failures
      return res.status(200).json({  // Using 200 instead of 500 to ensure client gets the error message
        success: false,
        message: 'Unable to save your message. Please try again later.',
        error: isVercel ? dbError.name : dbError.message
      });
    }
  } catch (error) {
    console.error('Error in contact API:', error);
    // Return 200 with error info instead of 500 to make debugging easier
    return res.status(200).json({ 
      success: false,
      message: 'Failed to process your request. Please try again later.',
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