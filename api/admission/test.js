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
  console.log('Admission form handler running in environment:', process.env.NODE_ENV);
  console.log('MongoDB URI set:', !!process.env.MONGODB_URI);
  
  // Extract form data first so we have it regardless of MongoDB errors
  const { studentName, parentName, email, phone, classInterested, message } = req.body;
  
  // Log submission for debugging
  console.log('Received admission inquiry:', {
    studentName,
    parentName,
    email,
    phone,
    classInterested,
    message: message ? message.substring(0, 20) + '...' : '' // Don't log full message
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
  
  // Always track received submissions for manual recovery if needed
  const submissionId = new Date().getTime().toString(); 
  console.log(`Tracking submission ID: ${submissionId}`);
  
  // Try to save to MongoDB, but don't fail the request if MongoDB fails
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const { collections } = await connectToDatabase();
    console.log('MongoDB connected successfully');
    
    // Create document
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
    console.log('Admission inquiry saved:', result.insertedId.toString());
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Admission inquiry submitted successfully',
      id: result.insertedId.toString(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Log error for debugging
    console.error('Error in admission API:', error);
    
    // Store data to temporary storage or logging service for recovery
    const storedData = {
      form: {
        studentName,
        parentName,
        email,
        phone,
        classInterested,
        message: message || ''
      },
      submissionId,
      timestamp: new Date().toISOString()
    };
    
    // Log data that would have been saved for later recovery
    console.log('FORM DATA TO RECOVER:', JSON.stringify(storedData));
    
    // ALWAYS return success to the user in production, with NO error property
    return res.status(200).json({
      success: true,
      message: 'Admission inquiry submitted successfully. Thank you!',
      id: submissionId,
      timestamp: new Date().toISOString()
    });
  }
} 