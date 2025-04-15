export default function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
    
    // Here you would typically save to a database
    // For now, we'll just return success
    console.log('Admission inquiry:', req.body);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Admission inquiry submitted successfully' 
    });
  } catch (error) {
    console.error('Error in admission API:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to process your request' 
    });
  }
} 