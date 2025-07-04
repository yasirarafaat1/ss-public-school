import { ref, set, get, push, remove } from "firebase/database";
import { database } from "./firebaseService";

const db = database;

export const updateFeeStructure = async (feeData) => {
  try {
    // Ensure we're only saving the classes array and lastUpdated
    const dataToSave = {
      classes: feeData.classes || [],
      lastUpdated: new Date().toISOString()
    };
    await set(ref(db, 'settings/feeStructure'), dataToSave);
    return true;
  } catch (error) {
    console.error("Error updating fee structure:", error);
    throw error;
  }
};

export const getFeeStructure = async () => {
  try {
    const snapshot = await get(ref(db, 'settings/feeStructure'));
    return snapshot.val() || { classes: [] };
  } catch (error) {
    console.error("Error fetching fee structure:", error);
    throw error;
  }
};

export const updateImportantDates = async (datesData) => {
  try {
    // Ensure we're only saving the dates array and lastUpdated
    const dataToSave = {
      dates: datesData.dates || [],
      lastUpdated: new Date().toISOString()
    };
    await set(ref(db, 'settings/importantDates'), dataToSave);
    return true;
  } catch (error) {
    console.error("Error updating important dates:", error);
    throw error;
  }
};

export const getImportantDates = async () => {
  try {
    const snapshot = await get(ref(db, 'settings/importantDates'));
    return snapshot.val() || { dates: [] };
  } catch (error) {
    console.error("Error fetching important dates:", error);
    throw error;
  }
};

// Staff Management Functions
export const getStaffMembers = async () => {
  try {
    const snapshot = await get(ref(db, 'staff'));
    if (snapshot.exists()) {
      // Convert the object of staff members to an array with IDs
      const staffArray = [];
      snapshot.forEach((childSnapshot) => {
        staffArray.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      return staffArray;
    }
    return [];
  } catch (error) {
    console.error("Error fetching staff members:", error);
    throw error;
  }
};

export const addStaffMember = async (staffData) => {
  try {
    const staffRef = ref(db, 'staff');
    const newStaffRef = push(staffRef);
    await set(newStaffRef, {
      ...staffData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: newStaffRef.key, ...staffData };
  } catch (error) {
    console.error("Error adding staff member:", error);
    throw error;
  }
};

export const updateStaffMember = async (id, staffData) => {
  try {
    const staffRef = ref(db, `staff/${id}`);
    await set(staffRef, {
      ...staffData,
      updatedAt: new Date().toISOString()
    });
    return { id, ...staffData };
  } catch (error) {
    console.error("Error updating staff member:", error);
    throw error;
  }
};

export const deleteStaffMember = async (id) => {
  try {
    const staffRef = ref(db, `staff/${id}`);
    await remove(staffRef);
    return id;
  } catch (error) {
    console.error("Error deleting staff member:", error);
    throw error;
  }
};
