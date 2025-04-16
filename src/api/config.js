import axios from 'axios';

// Use the origin URL for API calls
const origin = typeof window !== 'undefined' ? window.location.origin : '';
const API_URL = origin; // Base URL is just the origin, we'll add /api in each request

// Log the configuration for debugging
console.log('API configuration:', {
  origin,
  API_URL,
  environment: process.env.NODE_ENV
});

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: window.location.origin,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor
apiClient.interceptors.response.use(
  response => {
    // For successful responses, return the data
    return response.data;
  },
  error => {
    // Handle network errors, timeout errors, etc.
    let errorMsg = 'Something went wrong. Please try again.';
    let errorDetail = null;
    let statusCode = null;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      statusCode = error.response.status;
      console.error('API Error Response:', error.response);

      if (statusCode === 404) {
        errorMsg = 'Resource not found. Please try again later.';
      } else if (statusCode === 405) {
        errorMsg = 'Method not allowed. Please contact support.';
      } else if (statusCode === 500) {
        errorMsg = 'Server error. Please try again later.';
      } else if (error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      }

      errorDetail = error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
      errorMsg = 'No response from server. Please check your internet connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
      errorMsg = 'Request failed. ' + error.message;
    }

    const formattedError = {
      message: errorMsg,
      detail: errorDetail,
      statusCode: statusCode,
      timestamp: new Date().toISOString()
    };

    console.error('Formatted API Error:', formattedError);
    return Promise.reject(formattedError);
  }
);

export default apiClient; 