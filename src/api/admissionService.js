import apiClient from './config';

export const submitAdmissionInquiry = async (formData) => {
  const payload = {
    studentName: formData.studentName,
    parentName: formData.parentName,
    email: formData.email,
    phone: formData.phone,
    classInterested: formData.classInterested,
    message: formData.message,
    status: 'pending'
  };

  // First try with Axios
  try {
    console.log('Submitting admission inquiry using axios...');
    const response = await apiClient.post('/api/admission/test', payload);
    console.log('Axios submission successful');
    return response.data;
  } catch (axiosError) {
    console.error('Error with axios submission:', axiosError);
    
    // If Axios fails (especially due to timeout), try with fetch
    if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
      console.log('Axios timed out, trying with fetch as fallback...');
      try {
        const url = `${window.location.origin}/api/admission/test`;
        console.log('Submitting to:', url);
        
        const fetchResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (!fetchResponse.ok) {
          throw new Error(`Fetch error: ${fetchResponse.status}`);
        }
        
        const data = await fetchResponse.json();
        console.log('Fetch fallback successful:', data);
        return data;
      } catch (fetchError) {
        console.error('Fetch fallback also failed:', fetchError);
        throw new Error(`Admission submission failed with both methods. ${fetchError.message}`);
      }
    }
    
    // Not a timeout, re-throw the original error
    throw axiosError;
  }
}; 