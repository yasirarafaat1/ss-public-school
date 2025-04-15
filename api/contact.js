export default function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Here you would typically save to a database or send an email
    // For now, we'll just return success
    console.log('Contact form submission:', req.body);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Error in contact API:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to process your request' 
    });
  }
} 