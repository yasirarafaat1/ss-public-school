import { connectToDatabase } from './utils/mongodb';

export default async function handler(req, res) {
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

  let dbClient = null;

  try {
    // Log the request body for debugging
    console.log('Received contact form data:', req.body);
    
    const { name, email, phone, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ 
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
        status: 'new'
      };
      
      // Save to MongoDB
      console.log('Saving contact form to database...');
      const result = await collections.contacts.insertOne(contactDocument);
      console.log('Contact form saved to database:', result);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Message sent successfully',
        id: result.insertedId
      });
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      // More specific error message for database operation failures
      return res.status(500).json({
        success: false,
        message: 'Database error: Unable to save your message',
        error: dbError.message
      });
    }
  } catch (error) {
    console.error('Error in contact API:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to process your request',
      error: error.message
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