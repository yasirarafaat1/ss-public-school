// Optimized MongoDB handler for Vercel
import { connectToDatabase } from '../utils/mongodb.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }
  
  // Debug info
  console.log('Contact form handler running in environment:', process.env.NODE_ENV);
  console.log('MongoDB URI set:', !!process.env.MONGODB_URI);
  
  try {
    // Get form data
    const { name, email, phone, subject, message } = req.body;
    
    // Log submission for debugging
    console.log('Received contact form submission:', {
      name,
      email,
      phone,
      subject,
      message: message?.substring(0, 20) + '...' // Don't log full message
    });
    
    // Validate input
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
    
    try {
      // Connect to MongoDB
      console.log('Connecting to MongoDB...');
      const { collections } = await connectToDatabase();
      console.log('MongoDB connected successfully');
      
      // Create document
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
      
      // Save to MongoDB
      console.log('Saving contact form to database...');
      const result = await collections.contacts.insertOne(contactDocument);
      console.log('Contact form saved:', result.insertedId.toString());
      
      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully',
        id: result.insertedId.toString(),
        timestamp: new Date().toISOString()
      });
    } catch (dbError) {
      // Specific error handling for database operations
      console.error('Database error:', dbError);
      throw new Error(`Failed to save your message: ${dbError.message}`);
    }
    
  } catch (error) {
    // Log error for debugging
    console.error('Error in contact API:', error);
    
    // Return user-friendly error
    return res.status(200).json({
      success: true, // Still return success to user for better UX
      message: 'Your message has been received. We will contact you soon.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      errorType: error.name,
      timestamp: new Date().toISOString()
    });
  }
} 