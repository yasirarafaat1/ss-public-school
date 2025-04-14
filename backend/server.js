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
  // Force a fresh connection
  autoIndex: true,
  retryWrites: true
})
.then(() => {
  console.log('Successfully connected to MongoDB');
  
  // Clear the Admission collection on startup to reset the schema
  try {
    const Admission = require('./models/Admission');
    // Drop the collection and recreate it
    Admission.collection.drop()
      .then(() => console.log('Admission collection dropped and will be recreated with the new schema'))
      .catch(err => {
        if (err.code === 26) {
          console.log('Collection does not exist yet, will be created with new schema');
        } else {
          console.error('Error dropping collection:', err);
        }
      });
  } catch (err) {
    console.error('Error resetting admission collection:', err);
  }
})
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the server at: http://localhost:${PORT}/api/test`);
}); 