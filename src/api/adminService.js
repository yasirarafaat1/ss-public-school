import apiClient from './config';

/**
 * Get all admission inquiries
 * @returns {Promise<Array>} Array of admission inquiries
 */
export const getAdmissionInquiries = async () => {
  try {
    const response = await apiClient.get('/api/admission');
    return response.data;
  } catch (error) {
    console.error('Error fetching admission inquiries:', error);
    throw error;
  }
};

/**
 * Get all contact form submissions
 * @returns {Promise<Array>} Array of contact form submissions
 */
export const getContactSubmissions = async () => {
  try {
    const response = await apiClient.get('/api/contact');
    return response.data;
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    throw error;
  }
};

/**
 * Delete an admission inquiry
 * @param {string} id - ID of the admission inquiry to delete
 * @returns {Promise<Object>} Response from the API
 */
export const deleteAdmissionInquiry = async (id) => {
  try {
    const response = await apiClient.delete(`/api/admission?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting admission inquiry:', error);
    throw error;
  }
};

/**
 * Delete a contact form submission
 * @param {string} id - ID of the contact form submission to delete
 * @returns {Promise<Object>} Response from the API
 */
export const deleteContactSubmission = async (id) => {
  try {
    const response = await apiClient.delete(`/api/contact?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    throw error;
  }
}; 