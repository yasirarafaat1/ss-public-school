// Admissions API for GET requests
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
  
  if (req.method === 'GET') {
    // Retrieve all admission inquiries
    try {
      // Connect to MongoDB
      console.log('Connecting to MongoDB...');
      const { collections } = await connectToDatabase();
      console.log('MongoDB connected successfully');
      
      // Get all admission inquiries
      const admissions = await collections.admissions
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return res.status(200).json(admissions);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      return res.status(500).json({ error: 'Failed to fetch admissions data' });
    }
  } else if (req.method === 'DELETE') {
    // Delete an admission inquiry by ID
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Missing admission ID' });
      }
      
      // Connect to MongoDB
      const { collections } = await connectToDatabase();
      const result = await collections.admissions.deleteOne({ _id: id });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Admission not found' });
      }
      
      return res.status(200).json({ success: true, message: 'Admission deleted successfully' });
    } catch (error) {
      console.error('Error deleting admission:', error);
      return res.status(500).json({ error: 'Failed to delete admission' });
    }
  } else {
    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 