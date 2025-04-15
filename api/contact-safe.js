// A version of the contact API that works even without a database connection
// Use this if you're having MongoDB connection issues

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

  try {
    // Log the request body for debugging
    console.log('Received contact form data (safe version):', req.body);
    
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
    
    // Instead of saving to database, just log the data
    console.log('Contact form data received (not saved to DB):', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString()
    });
    
    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Message received successfully (database storage disabled)',
      note: 'This is a fallback API that does not store data in MongoDB. Use for testing only.'
    });
  } catch (error) {
    console.error('Error in contact-safe API:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to process your request',
      error: error.message
    });
  }
} 