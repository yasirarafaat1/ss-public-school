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

  // Only allow GET method for this endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let dbClient = null;

  try {
    // Connect to the database
    const { collections, client } = await connectToDatabase();
    dbClient = client;
    
    // Get all admission inquiries, sorted by createdAt in descending order (newest first)
    const admissions = await collections.admissions
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return res.status(200).json({ 
      success: true, 
      count: admissions.length,
      data: admissions
    });
  } catch (error) {
    console.error('Error in admin/admissions API:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve admission inquiries from the database',
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