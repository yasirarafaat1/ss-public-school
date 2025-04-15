// Simplified emergency version that works in Vercel
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
  
  try {
    // Get form data
    const { name, email, phone, subject, message } = req.body;
    
    // Log submission for debugging
    console.log('Received contact form submission:', {
      name,
      email,
      phone,
      subject,
      message
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
    
    // Return immediate success response
    // This is a fallback solution until MongoDB connection issues are resolved
    return res.status(200).json({
      success: true,
      message: 'Message received successfully. We will get back to you soon.',
      timestamp: new Date().toISOString(),
      serverInfo: {
        environment: process.env.VERCEL_ENV || 'development'
      }
    });
    
  } catch (error) {
    // Log error for debugging
    console.error('Error in contact API:', error);
    
    // Return user-friendly error
    return res.status(200).json({
      success: false,
      message: 'We apologize, but we could not process your message at this time. Please try again later or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
} 