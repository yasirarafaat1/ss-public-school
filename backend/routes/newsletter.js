const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// Get all newsletter subscribers
router.get('/', async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new newsletter subscriber
router.post('/', async (req, res) => {
  const subscriber = new Newsletter({
    email: req.body.email,
    status: 'Active'
  });

  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete newsletter subscriber
router.delete('/:id', async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    await subscriber.deleteOne();
    res.json({ message: 'Subscriber deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 