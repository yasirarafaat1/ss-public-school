const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-db';
console.log('Attempting to connect to MongoDB at:', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Successfully connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const contactRoutes = require('./routes/contact');
const admissionRoutes = require('./routes/admission');
const newsletterRoutes = require('./routes/newsletter');

app.use('/api/contact', contactRoutes);
app.use('/api/admission', admissionRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Add a test route
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Backend is working!' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the server at: http://localhost:${PORT}/api/test`);
}); 