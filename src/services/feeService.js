import { supabase } from './supabaseService';

/**
 * Fetches all fee records for students.
 * @returns {Promise<Array<object>>} Array of fee records with student and class information.
 */
export const getFees = async () => {
    try {
        let { data, error } = await supabase
            .from('fees')
            .select(`
                *,
                students(id, student_name, father_name, registration_number),
                classes(class_number, class_code),
                sessions(start_year, start_month, end_year, end_month)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching fees:", error.message);
        throw error;
    }
};

/**
 * Fetches fee records for a specific student.
 * @param {number} studentId - ID of the student.
 * @returns {Promise<Array<object>>} Array of fee records for the student.
 */
export const getFeesByStudentId = async (studentId) => {
    try {
        let { data, error } = await supabase
            .from('fees')
            .select(`
                *,
                classes(class_number, class_code),
                sessions(start_year, start_month, end_year, end_month)
            `)
            .eq('student_id', studentId)
            .order('year', { ascending: false })
            .order('month', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching fees by student ID:", error.message);
        throw error;
    }
};

/**
 * Fetches fee records for a specific student in a specific session.
 * @param {number} studentId - ID of the student.
 * @param {number} sessionId - ID of the session.
 * @returns {Promise<Array<object>>} Array of fee records for the student in the session.
 */
export const getFeesByStudentIdAndSessionId = async (studentId, sessionId) => {
    try {
        let { data, error } = await supabase
            .from('fees')
            .select(`
                *,
                classes(class_number, class_code),
                sessions(start_year, start_month, end_year, end_month)
            `)
            .eq('student_id', studentId)
            .eq('session_id', sessionId)
            .order('year', { ascending: false })
            .order('month', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching fees by student ID and session ID:", error.message);
        throw error;
    }
};

/**
 * Adds a new fee record.
 * @param {object} feeData - Data for the new fee record.
 * @returns {Promise<object>} Response object with inserted data or error.
 */
export const addFee = async (feeData) => {
    try {
        const feeToInsert = {
            student_id: feeData.studentId,
            class_id: feeData.classId,
            session_id: feeData.sessionId,
            roll_number: feeData.rollNumber,
            month: feeData.month,
            year: feeData.year,
            amount: feeData.amount,
            paid_amount: feeData.paidAmount || 0,
            status: feeData.status || 'pending',
            payment_date: feeData.paymentDate || null,
            notes: feeData.notes || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('fees')
            .insert([feeToInsert])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error("Error adding fee:", error.message);
        throw error;
    }
};

/**
 * Updates an existing fee record.
 * @param {number} id - ID of the fee record to update.
 * @param {object} feeData - Updated data for the fee record.
 * @returns {Promise<object>} Response object with updated data or error.
 */
export const updateFee = async (id, feeData) => {
    try {
        const feeToUpdate = {
            student_id: feeData.studentId,
            class_id: feeData.classId,
            session_id: feeData.sessionId,
            roll_number: feeData.rollNumber,
            month: feeData.month,
            year: feeData.year,
            amount: feeData.amount,
            paid_amount: feeData.paidAmount || 0,
            status: feeData.status || 'pending',
            payment_date: feeData.paymentDate || null,
            notes: feeData.notes || null,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('fees')
            .update(feeToUpdate)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error("Error updating fee:", error.message);
        throw error;
    }
};

/**
 * Deletes a fee record.
 * @param {number} id - ID of the fee record to delete.
 * @returns {Promise<object>} Response object.
 */
export const deleteFee = async (id) => {
    try {
        const { error } = await supabase
            .from('fees')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Error deleting fee:", error.message);
        throw error;
    }
};

/**
 * Fetches all students with their latest fee information for the current session.
 * @returns {Promise<Array<object>>} Array of students with fee information.
 */
export const getStudentsWithFeesForCurrentSession = async () => {
    try {
        // First get the latest session
        const { data: sessions, error: sessionError } = await supabase
            .from('sessions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);

        if (sessionError) throw sessionError;

        if (!sessions || sessions.length === 0) {
            return [];
        }

        const currentSession = sessions[0];

        // Now get all students with their class assignments for the current session
        let { data, error } = await supabase
            .from('student_classes')
            .select(`
                *,
                students(id, student_name, father_name, registration_number, mobile_number, email),
                classes(class_number, class_code)
            `)
            .eq('session_id', currentSession.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // For each student, get their fee information
        const studentsWithFees = [];
        for (const studentClass of data) {
            // Get the total fees and paid amount for this student in the current session
            const { data: feesData, error: feesError } = await supabase
                .from('fees')
                .select('amount, paid_amount, status')
                .eq('student_id', studentClass.student_id)
                .eq('session_id', currentSession.id);

            if (!feesError && feesData) {
                const totalFees = feesData.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);
                const totalPaid = feesData.reduce((sum, fee) => sum + parseFloat(fee.paid_amount || 0), 0);
                const totalDue = totalFees - totalPaid;

                studentsWithFees.push({
                    ...studentClass,
                    student_info: studentClass.students,
                    class_info: studentClass.classes,
                    session_info: currentSession,
                    total_fees: totalFees,
                    total_paid: totalPaid,
                    total_due: totalDue,
                    fee_status: totalDue > 0 ? (totalPaid > 0 ? 'partial' : 'pending') : 'paid'
                });
            } else {
                studentsWithFees.push({
                    ...studentClass,
                    student_info: studentClass.students,
                    class_info: studentClass.classes,
                    session_info: currentSession,
                    total_fees: 0,
                    total_paid: 0,
                    total_due: 0,
                    fee_status: 'no_fees'
                });
            }
        }

        return studentsWithFees;
    } catch (error) {
        console.error("Error fetching students with fees for current session:", error.message);
        throw error;
    }
};

/**
 * Fetches fee summary for a specific student.
 * @param {number} studentId - ID of the student.
 * @returns {Promise<object>} Fee summary for the student.
 */
export const getStudentFeeSummary = async (studentId) => {
    try {
        // Get student details
        const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select('*')
            .eq('id', studentId)
            .single();

        if (studentError) throw studentError;

        // Get latest class assignment for the student
        const { data: classAssignment, error: classError } = await supabase
            .from('student_classes')
            .select(`
                *,
                classes(class_number, class_code),
                sessions(start_year, start_month, end_year, end_month)
            `)
            .eq('student_id', studentId)
            .order('created_at', { ascending: false })
            .limit(1);

        if (classError) throw classError;

        let currentAssignment = null;
        if (classAssignment && classAssignment.length > 0) {
            currentAssignment = classAssignment[0];
        }

        // Get all fees for this student
        const { data: feesData, error: feesError } = await supabase
            .from('fees')
            .select('*')
            .eq('student_id', studentId)
            .order('year', { ascending: false })
            .order('month', { ascending: false });

        if (feesError) throw feesError;

        const totalFees = feesData.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);
        const totalPaid = feesData.reduce((sum, fee) => sum + parseFloat(fee.paid_amount || 0), 0);
        const totalDue = totalFees - totalPaid;

        return {
            student: studentData,
            current_assignment: currentAssignment,
            fees: feesData,
            total_fees: totalFees,
            total_paid: totalPaid,
            total_due: totalDue,
            fee_status: totalDue > 0 ? (totalPaid > 0 ? 'partial' : 'pending') : 'paid'
        };
    } catch (error) {
        console.error("Error fetching student fee summary:", error.message);
        throw error;
    }
};