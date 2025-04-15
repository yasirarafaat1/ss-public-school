import apiClient from './config';

export const submitAdmissionInquiry = async (formData) => {
  try {
    const payload = {
      studentName: formData.studentName,
      parentName: formData.parentName,
      email: formData.email,
      phone: formData.phone,
      classInterested: formData.classInterested,
      message: formData.message,
      status: 'pending'
    };
    
    const response = await apiClient.post('/api/admission/test', payload);
    return response.data;
  } catch (error) {
    console.error('Error submitting admission inquiry:', error);
    throw error;
  }
}; 