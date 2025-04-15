// Modern ES module script to test API endpoints
import { fetch } from 'undici';

const BASE_URL = 'http://localhost:3000';

// Test the admission API endpoint
async function testAdmissionAPI() {
  console.log('\n📝 Testing admission API endpoint...');
  
  const testData = {
    studentName: 'Test Student',
    parentName: 'Test Parent',
    email: 'test@example.com',
    phone: '1234567890',
    classInterested: 'Class 7',
    message: 'Test message from script'
  };
  
  try {
    console.log('Sending test data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(`${BASE_URL}/api/admission/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Response status:', response.status);
    
    try {
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      if (data.success) {
        console.log('✅ Test successful - admission form submitted');
      } else {
        console.log('❌ Test failed - admission form submission failed');
        console.log('Error details:', data.error || 'No error details provided');
      }
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError.message);
      
      // Try to get the raw text
      try {
        const text = await response.text();
        console.log('Raw response:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
      } catch (textError) {
        console.error('❌ Failed to get response text:', textError.message);
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Test the contact API endpoint
async function testContactAPI() {
  console.log('\n✉️ Testing contact API endpoint...');
  
  const testData = {
    name: 'Test Person',
    email: 'test@example.com',
    phone: '1234567890',
    subject: 'API Test',
    message: 'Test message from API test script'
  };
  
  try {
    console.log('Sending test data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Response status:', response.status);
    
    try {
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      if (data.success) {
        console.log('✅ Test successful - contact form submitted');
      } else {
        console.log('❌ Test failed - contact form submission failed');
        console.log('Error details:', data.error || 'No error details provided');
      }
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError.message);
      
      // Try to get the raw text
      try {
        const text = await response.text();
        console.log('Raw response:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
      } catch (textError) {
        console.error('❌ Failed to get response text:', textError.message);
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting API tests...');
  console.log(`🔗 Base URL: ${BASE_URL}`);
  
  // Run tests in sequence
  await testAdmissionAPI();
  await testContactAPI();
  
  console.log('\n🏁 All tests completed');
}

runAllTests().catch(err => {
  console.error('❌ Test runner error:', err);
}); 