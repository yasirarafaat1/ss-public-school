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
    const { studentName, parentName, email, phone, classInterested, message } = req.body;
    
    // Log submission for debugging
    console.log('Received admission inquiry:', {
      studentName,
      parentName,
      email,
      phone,
      classInterested,
      message
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
    
    // Return immediate success response
    // This is a fallback solution until MongoDB connection issues are resolved
    return res.status(200).json({
      success: true,
      message: 'Admission inquiry received successfully',
      timestamp: new Date().toISOString(),
      serverInfo: {
        environment: process.env.VERCEL_ENV || 'development'
      }
    });
    
  } catch (error) {
    // Log error for debugging
    console.error('Error in admission API:', error);
    
    // Return user-friendly error
    return res.status(200).json({
      success: false,
      message: 'We apologize, but we could not process your submission at this time. Please try again later or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
} 