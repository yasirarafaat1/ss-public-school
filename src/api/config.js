import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 