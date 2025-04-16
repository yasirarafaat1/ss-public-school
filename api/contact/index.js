// Contacts API for GET requests
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
    // Retrieve all contact messages
    try {
      // Connect to MongoDB
      console.log('Connecting to MongoDB...');
      const { collections } = await connectToDatabase();
      console.log('MongoDB connected successfully');
      
      // Get all contacts
      const contacts = await collections.contacts
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return res.status(200).json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return res.status(500).json({ error: 'Failed to fetch contact data' });
    }
  } else if (req.method === 'DELETE') {
    // Delete a contact message by ID
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Missing contact ID' });
      }
      
      // Connect to MongoDB
      const { collections } = await connectToDatabase();
      const result = await collections.contacts.deleteOne({ _id: id });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      return res.status(200).json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      return res.status(500).json({ error: 'Failed to delete contact' });
    }
  } else {
    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 