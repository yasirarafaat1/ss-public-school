import { getStaffMembers, addStaffMember, updateStaffMember, deleteStaffMember } from "./supabaseService";

// All functions now imported from supabaseService
// Re-export them for backward compatibility
export { getStaffMembers, addStaffMember, updateStaffMember, deleteStaffMember };