// Simple script to verify data saved to MongoDB
const { MongoClient } = require('mongodb');

async function verifyData() {
  console.log('Connecting to MongoDB to verify data...');
  
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schooldb';
  const dbName = uri.split('/').pop()?.split('?')[0] || 'schooldb';
  
  let client = null;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(uri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      directConnection: true
    });
    
    await client.connect();
    console.log(`Connected to ${dbName} database`);
    
    const db = client.db(dbName);
    
    // Check contacts collection
    console.log('\n--- CONTACTS ---');
    const contacts = await db.collection('contacts')
      .find({})
      .sort({ _id: -1 })
      .limit(3)
      .toArray();
    
    if (contacts.length === 0) {
      console.log('No contacts found');
    } else {
      console.log(`Found ${contacts.length} contacts:`);
      contacts.forEach((contact, index) => {
        console.log(`\nContact #${index + 1}:`);
        console.log(`Name: ${contact.name}`);
        console.log(`Email: ${contact.email}`);
        console.log(`Subject: ${contact.subject}`);
        console.log(`Message: ${contact.message}`);
        console.log(`Created: ${contact.createdAt}`);
      });
    }
    
    // Check admissions collection
    console.log('\n--- ADMISSIONS ---');
    const admissions = await db.collection('admissions')
      .find({})
      .sort({ _id: -1 })
      .limit(3)
      .toArray();
    
    if (admissions.length === 0) {
      console.log('No admissions found');
    } else {
      console.log(`Found ${admissions.length} admissions:`);
      admissions.forEach((admission, index) => {
        console.log(`\nAdmission #${index + 1}:`);
        console.log(`Student: ${admission.studentName}`);
        console.log(`Parent: ${admission.parentName}`);
        console.log(`Email: ${admission.email}`);
        console.log(`Class: ${admission.classInterested}`);
        console.log(`Message: ${admission.message}`);
        console.log(`Created: ${admission.createdAt}`);
      });
    }
    
    console.log('\nVerification complete!');
  } catch (error) {
    console.error('Error verifying data:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the verification
verifyData().catch(console.error); 