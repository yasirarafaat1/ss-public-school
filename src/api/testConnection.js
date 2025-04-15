import apiClient from './config';

// Get absolute URL based on the environment
const getAbsoluteUrl = (relativeUrl) => {
  const baseUrl = import.meta.env.VITE_API_URL || '/api';
  
  // If the baseUrl is already a full URL (starts with http)
  if (baseUrl.startsWith('http')) {
    return `${baseUrl}${relativeUrl.startsWith('/') ? relativeUrl : '/' + relativeUrl}`;
  }
  
  // If it's a relative URL, use the current window location
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${baseUrl}${relativeUrl.startsWith('/') ? relativeUrl : '/' + relativeUrl}`;
};

// Test API connectivity using fetch instead of axios
export const testApiConnection = async () => {
  try {
    const corsEndpoint = '/cors';
    const absoluteUrl = getAbsoluteUrl(corsEndpoint);
    console.log('Testing API connection to:', absoluteUrl);
    
    // First try with axios
    try {
      const response = await apiClient.get(corsEndpoint);
      console.log('API Connection Test with axios:', response.data);
      return {
        success: true,
        message: 'Successfully connected to API using axios',
        data: response.data,
        method: 'axios',
        url: absoluteUrl
      };
    } catch (axiosError) {
      console.warn('Axios test failed, trying with fetch:', axiosError.message);
      
      // If axios fails, try with fetch as a fallback
      const response = await fetch(absoluteUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Connection Test with fetch:', data);
      return {
        success: true,
        message: 'Successfully connected to API using fetch (axios failed)',
        data: data,
        method: 'fetch',
        url: absoluteUrl,
        axiosError: axiosError.message
      };
    }
  } catch (error) {
    console.error('API Connection Test Failed:', error);
    
    return {
      success: false,
      message: 'Failed to connect to API with both axios and fetch',
      error: {
        message: error.message,
        stack: error.stack
      }
    };
  }
};

// Function to diagnose 405 errors using direct fetch
export const diagnose405Error = async (endpoint) => {
  try {
    const absoluteUrl = getAbsoluteUrl(endpoint);
    console.log('Diagnosing endpoint:', absoluteUrl);
    
    // Prepare results object
    const results = {
      success: true,
      url: absoluteUrl,
      tests: {}
    };
    
    // Test different HTTP methods
    for (const method of ['GET', 'POST', 'OPTIONS']) {
      try {
        const response = await fetch(absoluteUrl, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          // Add empty body for POST requests
          ...(method === 'POST' ? { body: JSON.stringify({}) } : {})
        });
        
        // Try to get response data
        let responseData = null;
        try {
          responseData = await response.text();
          try {
            responseData = JSON.parse(responseData);
          } catch (e) {
            // Keep as text if not JSON
          }
        } catch (e) {
          responseData = 'Could not read response data';
        }
        
        results.tests[method] = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          data: responseData
        };
      } catch (methodError) {
        results.tests[method] = {
          error: methodError.message
        };
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error diagnosing endpoint:', error);
    return {
      success: false,
      message: 'Error while diagnosing',
      error: error.message
    };
  }
}; 