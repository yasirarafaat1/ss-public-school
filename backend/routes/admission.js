const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');

// Get all admissions
router.get('/', async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) {
    console.error('Error fetching admissions:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create new admission
router.post('/', async (req, res) => {
  console.log('Received admission data:', req.body);
  
  try {
    // Validate required fields
    const requiredFields = ['studentName', 'parentName', 'email', 'phone', 'classInterested', 'subject', 'message'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    const admission = new Admission({
      studentName: req.body.studentName,
      parentName: req.body.parentName,
      email: req.body.email,
      phone: req.body.phone,
      classInterested: req.body.classInterested,
      subject: req.body.subject,
      message: req.body.message,
      status: req.body.status || 'pending'
    });

    const newAdmission = await admission.save();
    console.log('Saved admission:', newAdmission);
    res.status(201).json(newAdmission);
  } catch (err) {
    console.error('Error saving admission:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    res.status(500).json({ message: err.message });
  }
});

// Delete admission
router.delete('/:id', async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }
    await admission.deleteOne();
    res.json({ message: 'Admission deleted' });
  } catch (err) {
    console.error('Error deleting admission:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 