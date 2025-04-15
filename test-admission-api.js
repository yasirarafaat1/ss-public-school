// Simple script to test the admission API endpoint
import('node-fetch').then(({ default: fetch }) => {
  async function testAdmissionAPI() {
    console.log('Testing admission API endpoint...');
    
    const testData = {
      studentName: 'Test Student',
      parentName: 'Test Parent',
      email: 'test@example.com',
      phone: '1234567890',
      classInterested: 'Class 7',
      message: 'Test message from script'
    };
    
    try {
      console.log('Sending test data:', testData);
      
      const response = await fetch('http://localhost:5174/api/admission/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      if (data.success) {
        console.log('✅ Test successful - admission form submitted');
      } else {
        console.log('❌ Test failed - admission form submission failed');
        console.log('Error details:', data.error || 'No error details provided');
      }
    } catch (error) {
      console.error('❌ Exception occurred during test:', error.message);
    }
  }

  // Run the test
  testAdmissionAPI();
}).catch(err => {
  console.error('Failed to import node-fetch:', err);
}); 