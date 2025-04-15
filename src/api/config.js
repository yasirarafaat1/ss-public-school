import axios from 'axios';

// Use the origin URL for API calls
const origin = typeof window !== 'undefined' ? window.location.origin : '';
const API_URL = origin; // Base URL is just the origin, we'll add /api in each request

// Create axios instance with the appropriate base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different types of errors
    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject(new Error('No response from server. Please check if the backend is running.'));
    }
    
    // Handle other errors based on status codes
    if (error.response.status === 404) {
      return Promise.reject(new Error('API endpoint not found'));
    } else if (error.response.status === 405) {
      return Promise.reject(new Error('Method not allowed. This endpoint doesn\'t support this HTTP method.'));
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 