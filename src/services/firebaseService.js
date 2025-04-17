// Firebase Service: Handles all Firebase interactions (Auth, Realtime Database)

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

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
    // Assuming admissions are stored under 'admissions' node
    const admissionsRef = ref(database, 'admissions'); 
    const newEnquiryRef = push(admissionsRef);
    await set(newEnquiryRef, {
        ...enquiryData,
        submittedAt: new Date().toISOString()
    });
    console.log("Admission enquiry submitted successfully:", newEnquiryRef.key);
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
    const contactFormsRef = ref(database, 'contactForms');
    const snapshot = await get(contactFormsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convert object of objects into an array of objects with IDs
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    } else {
      return []; // Return empty array if no data
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
    // Assuming admissions are stored under 'admissions' node
    const admissionsRef = ref(database, 'admissions'); 
    const snapshot = await get(admissionsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
       // Convert object of objects into an array of objects with IDs
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    } else {
      return []; // Return empty array if no data
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
    // Assuming subscriptions are stored under 'newsletterSubscriptions' node
    const newsletterRef = ref(database, 'newsletterSubscriptions'); 
    const snapshot = await get(newsletterRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
       // Convert object of objects into an array of objects with IDs
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    } else {
      return []; // Return empty array if no data
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

// Export auth, database, and onAuthStateChanged for use elsewhere (like ProtectedRoute)
export { auth, database, onAuthStateChanged }; 