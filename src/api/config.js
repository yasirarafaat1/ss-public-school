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

// Create axios instance with the appropriate base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // If we get a response with success: false, transform it to an error
    if (response.data && response.data.success === false) {
      const error = new Error(response.data.message || 'Operation failed');
      error.response = response;
      error.details = response.data;
      return Promise.reject(error);
    }
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject(new Error('No response from server. Please check your internet connection.'));
    }
    
    // Extract any useful information from the error response
    let errorMessage = 'An unexpected error occurred';
    let errorDetails = {};
    
    try {
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
          errorDetails = error.response.data;
        }
      }
    } catch (e) {
      console.error('Error parsing error response:', e);
    }
    
    // Handle specific status codes
    switch (error.response.status) {
      case 404:
        errorMessage = 'API endpoint not found';
        break;
      case 405:
        errorMessage = 'Method not allowed. This endpoint doesn\'t support this HTTP method.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later or contact support.';
        console.error('Server Error Details:', {
          url: error.config.url,
          method: error.config.method,
          data: error.config.data,
          response: error.response.data
        });
        break;
      default:
        console.error(`HTTP Error ${error.response.status}:`, error.response.data);
    }
    
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.details = errorDetails;
    enhancedError.status = error.response.status;
    
    return Promise.reject(enhancedError);
  }
);

export default apiClient; 