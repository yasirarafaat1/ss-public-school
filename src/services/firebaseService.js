import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged, // Needed for ProtectedRoute
  signOut as firebaseSignOut // Rename to avoid conflict if you have a local signOut function
} from "firebase/auth";
import {
  getDatabase,
  ref,
  get,
  push,
  set,
  query,
  orderByChild // Add other RTDB functions as needed
} from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// Read Firebase config from environment variables
const firebaseConfig = {
  // Ensure VITE_ prefix is used for Vite projects
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Optional
};

// Validate that config values are present (basic check)
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Firebase configuration environment variables are missing!");
  // You might want to throw an error or display a message to the user in a real app
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

// --- Authentication Functions ---

/**
 * Logs in an admin user.
 * @param {string} email - Admin's email.
 * @param {string} password - Admin's password.
 * @returns {Promise<UserCredential>} Firebase UserCredential object on success.
 */
export const adminLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Admin login successful:", userCredential.user);
    return userCredential;
  } catch (error) {
    console.error("Admin login error:", error.code, error.message);
    throw error; // Re-throw the error to be handled by the calling component
  }
};

/**
 * Logs out the current user.
 * @returns {Promise<void>}
 */
export const adminLogout = async () => {
  try {
    await firebaseSignOut(auth);
    console.log("Admin logout successful");
  } catch (error) {
    console.error("Admin logout error:", error);
    throw error;
  }
};

// --- Realtime Database Functions ---

/**
 * Submits a contact form entry to the database.
 * @param {object} formData - Data from the contact form.
 * @returns {Promise<string>} The key of the newly created entry.
 */
export const submitContactForm = async (formData) => {
  try {
    const contactFormsRef = ref(database, 'contactForms');
    const newFormRef = push(contactFormsRef); // Creates a unique key
    await set(newFormRef, {
      ...formData,
      submittedAt: new Date().toISOString() // Add a timestamp
    });
    console.log("Contact form submitted successfully:", newFormRef.key);
    return newFormRef.key; // Return the key
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
};

/**
 * Submits an admission enquiry to the database.
 * @param {object} enquiryData - Data from the admission form.
 * @returns {Promise<string>} The key of the newly created entry.
 */
export const submitAdmissionEnquiry = async (enquiryData) => {
  try {
    console.log('Submitting admission enquiry:', enquiryData);
    // Save to 'admissionEnquiries' node to match the reading path
    const admissionsRef = ref(database, 'admissionEnquiries');
    const newEnquiryRef = push(admissionsRef);

    // Create a complete data object with all required fields
    const enquiryWithMetadata = {
      ...enquiryData,
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Ensure all required fields have values
      studentName: enquiryData.studentName || 'Not provided',
      parentName: enquiryData.parentName || 'Not provided',
      email: enquiryData.email || 'No email provided',
      phone: enquiryData.phone || 'Not provided',
      classInterested: enquiryData.classInterested || 'Not specified',
      message: enquiryData.message || 'No message provided',
      status: 'new' // Add status field for tracking
    };

    await set(newEnquiryRef, enquiryWithMetadata);
    console.log("Admission enquiry submitted successfully. ID:", newEnquiryRef.key);
    return newEnquiryRef.key;
  } catch (error) {
    console.error("Error submitting admission enquiry:", error);
    throw error;
  }
};

/**
 * Submits a newsletter subscription email.
 * @param {string} email - Email address to subscribe.
 * @returns {Promise<string>} The key of the newly created entry.
 */
export const submitNewsletterSubscription = async (email) => {
  try {
    // Assuming subscriptions are stored under 'newsletterSubscriptions' node
    const newsletterRef = ref(database, 'newsletterSubscriptions');
    const newSubscriptionRef = push(newsletterRef);
    await set(newSubscriptionRef, {
      email: email,
      subscribedAt: new Date().toISOString()
    });
    console.log("Newsletter subscription successful:", newSubscriptionRef.key);
    return newSubscriptionRef.key;
  } catch (error) {
    console.error("Error submitting newsletter subscription:", error);
    // Handle specific errors, e.g., invalid email format if needed
    throw error;
  }
};

/**
 * Fetches all contact form submissions.
 * @returns {Promise<Array<object>>} Array of contact form objects with IDs.
 */
export const getContactForms = async () => {
  try {
    console.log('Fetching contact forms...');
    const formsRef = ref(database, 'contactForms');
    const snapshot = await get(formsRef);
    console.log('Contact forms snapshot:', snapshot.exists() ? 'exists' : 'does not exist');

    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('Raw contact forms data:', data);

      const result = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key],
        submittedAt: data[key].submittedAt || data[key].timestamp || new Date().toISOString(),
        name: data[key].name || 'Anonymous',
        email: data[key].email || 'No email provided',
        message: data[key].message || 'No message provided',
        timestamp: data[key].timestamp || new Date().toISOString(),
        // Add default values for required table fields
        phone: data[key].phone || 'N/A',
        subject: data[key].subject || 'No subject'
      })) : [];

      console.log('Processed contact forms:', result);
      return result;
    } else {
      console.log('No contact forms found');
      return [];
    }
  } catch (error) {
    console.error("Error fetching contact forms:", error);
    throw error;
  }
};

/**
 * Fetches all admission enquiries.
 * @returns {Promise<Array<object>>} Array of admission enquiry objects with IDs.
 */
export const getAdmissionEnquiries = async () => {
  try {
    console.log('Fetching admission enquiries...');
    const admissionsRef = ref(database, 'admissionEnquiries');
    const snapshot = await get(admissionsRef);
    console.log('Admission enquiries snapshot:', snapshot.exists() ? 'exists' : 'does not exist');

    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('Raw admission enquiries data:', data);

      const result = data ? Object.entries(data).map(([key, value]) => {
        // Ensure all required fields have values
        const enquiry = {
          id: key,
          studentName: value.studentName || 'Not provided',
          parentName: value.parentName || 'Not provided',
          email: value.email || 'No email provided',
          phone: value.phone || 'Not provided',
          classInterested: value.classInterested || 'Not specified',
          message: value.message || 'No message provided',
          status: value.status || 'new',
          // Handle timestamps
          submittedAt: value.submittedAt || value.createdAt || new Date().toISOString(),
          createdAt: value.createdAt || value.submittedAt || new Date().toISOString(),
          updatedAt: value.updatedAt || value.createdAt || value.submittedAt || new Date().toISOString()
        };

        // Add any additional fields that might be present
        Object.keys(value).forEach(field => {
          if (!enquiry.hasOwnProperty(field)) {
            enquiry[field] = value[field];
          }
        });

        return enquiry;
      }) : [];

      console.log('Processed admission enquiries:', result);
      return result;
    } else {
      console.log('No admission enquiries found');
      return [];
    }
  } catch (error) {
    console.error("Error fetching admission enquiries:", error);
    throw error;
  }
};

/**
 * Fetches all newsletter subscriptions.
 * @returns {Promise<Array<object>>} Array of newsletter subscription objects with IDs.
 */
export const getNewsletterSubscriptions = async () => {
  try {
    console.log('Fetching newsletter subscriptions...');
    const newsletterRef = ref(database, 'newsletterSubscriptions');
    const snapshot = await get(newsletterRef);
    console.log('Newsletter subscriptions snapshot:', snapshot.exists() ? 'exists' : 'does not exist');

    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('Raw newsletter subscriptions data:', data);

      const result = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key],
        email: data[key].email || 'No email provided',
        subscribedAt: data[key].subscribedAt || data[key].timestamp || new Date().toISOString(),
        timestamp: data[key].timestamp || data[key].subscribedAt || new Date().toISOString(),
        // Add default values for display
        name: data[key].name || 'Subscriber'
      })) : [];

      console.log('Processed newsletter subscriptions:', result);
      return result;
    } else {
      console.log('No newsletter subscriptions found');
      return [];
    }
  } catch (error) {
    console.error("Error fetching newsletter subscriptions:", error);
    throw error;
  }
};

// --- Placeholder Functions (Implement based on your RTDB structure) ---

const getStaffMembers = async () => {
  console.warn("getStaffMembers not implemented for Realtime Database yet.");
  // TODO: Implement logic to fetch staff from RTDB (e.g., ref(database, 'staff'))
  return [];
};

const getGalleryImages = async () => {
  console.warn("getGalleryImages not implemented for Realtime Database yet.");
  // TODO: Implement logic to fetch gallery images from RTDB (e.g., ref(database, 'gallery'))
  return [];
};

const getNewsAndEvents = async () => {
  console.warn("getNewsAndEvents not implemented for Realtime Database yet.");
  // TODO: Implement logic to fetch news/events from RTDB (e.g., ref(database, 'news'))
  return [];
};

const getInfrastructureDetails = async () => {
  console.warn("getInfrastructureDetails not implemented for Realtime Database yet.");
  // TODO: Implement logic to fetch infrastructure details from RTDB (e.g., ref(database, 'infrastructure'))
  return {}; // Or appropriate default
};

export const getPublicFeeStructure = async () => {
  try {
    const snapshot = await get(ref(database, 'settings/feeStructure'));
    return snapshot.val() || { classes: [] };
  } catch (error) {
    console.error("Error fetching public fee structure:", error);
    return { classes: [] };
  }
};

export const getPublicImportantDates = async () => {
  try {
    const snapshot = await get(ref(database, 'settings/importantDates'));
    return snapshot.val() || { dates: [] };
  } catch (error) {
    console.error("Error fetching public important dates:", error);
    return { dates: [] };
  }
};

// Function to upload a file to Firebase Storage
export const uploadFile = async (file, path = 'staff') => {
  try {

    if (!file) {
      throw new Error('No file provided');
    }

    // Create a reference to the file in Firebase Storage
    const fileRef = storageRef(storage, `${path}/${Date.now()}_${file.name}`);

    // Set metadata to avoid CORS issues
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'Access-Control-Allow-Origin': '*'
      }
    };

    // Upload the file
    const snapshot = await uploadBytes(fileRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      downloadURL,
      fileName: file.name,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Export auth, database, storage, app, and onAuthStateChanged for use elsewhere
export { auth, database, storage, onAuthStateChanged };