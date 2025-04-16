// Admin API handler for Vercel
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
  
  // Only handle GET requests for listing data
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }
  
  // Debug info
  console.log('Admin API handler running in environment:', process.env.NODE_ENV);
  console.log('MongoDB URI set:', !!process.env.MONGODB_URI);
  
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const { collections } = await connectToDatabase();
    console.log('MongoDB connected successfully');
    
    // Get collections data
    const admissions = await collections.admissions
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
      
    const contacts = await collections.contacts
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    // Return data
    return res.status(200).json({
      success: true,
      admissions,
      contacts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Log error for debugging
    console.error('Error in admin API:', error);
    
    // Return error
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
} 