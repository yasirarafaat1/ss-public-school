import { connectToDatabase } from '../utils/mongodb';

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
    const { 
      studentName, 
      parentName, 
      email, 
      phone, 
      classInterested, 
      message 
    } = req.body;
    
    // Validate input
    if (!studentName || !parentName || !email || !phone || !classInterested) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    // Connect to the database
    const { collections, client } = await connectToDatabase();
    dbClient = client;
    
    // Format the document to save
    const admissionDocument = {
      studentName,
      parentName,
      email,
      phone,
      classInterested,
      message: message || '',
      createdAt: new Date(),
      status: 'pending'
    };
    
    // Save to MongoDB
    const result = await collections.admissions.insertOne(admissionDocument);
    console.log('Admission inquiry saved to database:', result);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Admission inquiry submitted successfully',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error in admission API:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to save your admission inquiry to the database',
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