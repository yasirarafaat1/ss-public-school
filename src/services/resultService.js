import { supabase } from './supabaseService';

/**
 * Fetches student results by roll number and class code
 * @param {string} rollNo - 6-digit roll number
 * @param {string} classCode - Class code
 * @returns {Promise<Array<object>|null>} Array of result objects or null if not found
 */
export const getResultByRollNoAndClassCode = async (rollNo, classCode) => {
    try {
        const { data, error } = await supabase
            .from('results')
            .select('*')
            .eq('roll_no', rollNo)
            .eq('class_code', classCode)
            .order('created_at', { ascending: false }); // Order by newest first

        if (error) {
            if (error.code === 'PGRST116') {
                // No rows found
                return null;
            }
            throw error;
        }

        // If no data found, return null
        if (!data || data.length === 0) {
            return null;
        }

        // Return all results for this student and class combination
        return data;
    } catch (error) {
        console.error('Error fetching result:', error.message);
        throw new Error('Failed to fetch result. Please try again.');
    }
};

/**
 * Fetches a result by its ID
 * @param {number} id - ID of the result to fetch
 * @returns {Promise<object|null>} Result object or null if not found
 */
export const getResultById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('results')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No row found
                return null;
            }
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error fetching result by ID:', error.message);
        throw new Error('Failed to fetch result. Please try again.');
    }
};

/**
 * Fetches all results
 * @returns {Promise<Array<object>>} Array of result objects
 */
export const getAllResults = async () => {
    try {
        const { data, error } = await supabase
            .from('results')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching results:', error.message);
        throw new Error('Failed to fetch results. Please try again.');
    }
};

/**
 * Adds a result manually
 * @param {object} resultData - Result data to add
 * @returns {Promise<object>} Response object with inserted data
 */
export const addResultManually = async (resultData) => {
    try {
        // Check if exam type already exists for this roll number and class code
        const { data: existingResult, error: checkError } = await supabase
            .from('results')
            .select('id')
            .eq('roll_no', resultData.roll_no)
            .eq('class_code', resultData.class_code)
            .eq('exam_type', resultData.exam_type)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        if (existingResult) {
            throw new Error(`Exam type "${resultData.exam_type}" already exists for this roll number and class code`);
        }

        const resultToInsert = {
            student_name: resultData.student_name,
            roll_no: resultData.roll_no,
            class: resultData.class,
            class_code: resultData.class_code,
            exam_type: resultData.exam_type, // Include exam_type
            result_status: resultData.result_status,
            grade: resultData.grade,
            subjects: resultData.subjects || [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('results')
            .insert([resultToInsert])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error adding result:', error.message);
        throw new Error(error.message || 'Failed to add result. Please try again.');
    }
};

/**
 * Uploads results from a CSV file
 * @param {File} file - CSV file to upload
 * @returns {Promise<object>} Response object with count of uploaded results
 */
export const uploadResultsFromCSV = async (file) => {
    try {
        // Read the CSV file
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim() !== '');

        if (lines.length <= 1) {
            throw new Error('CSV file is empty or invalid');
        }

        // Parse CSV header
        const headers = lines[0].split(',').map(header => header.trim());

        // Check if this is the complete template (includes subject and marks)
        const isCompleteTemplate = headers.includes('subject') && headers.includes('marks');

        // Required columns
        const requiredColumns = isCompleteTemplate
            ? ['student_name', 'roll_no', 'class', 'class_code', 'result_status', 'grade', 'subject', 'marks']
            : ['student_name', 'roll_no', 'class', 'class_code', 'result_status', 'grade'];

        const missingColumns = requiredColumns.filter(col => !headers.includes(col));

        if (missingColumns.length > 0) {
            throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
        }

        if (isCompleteTemplate) {
            // Handle complete template with subjects and marks
            return await uploadCompleteResultsFromCSV(headers, lines);
        } else {
            // Handle basic template (student info only)
            return await uploadBasicResultsFromCSV(headers, lines);
        }
    } catch (error) {
        console.error('Error uploading results from CSV:', error.message);
        throw new Error(error.message || 'Failed to upload results from CSV. Please check the file format.');
    }
};

/**
 * Uploads basic results from a CSV file (student info only)
 * @param {Array<string>} headers - CSV headers
 * @param {Array<string>} lines - CSV lines
 * @returns {Promise<object>} Response object with count of uploaded results
 */
const uploadBasicResultsFromCSV = async (headers, lines) => {
    // Parse data rows
    const results = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim());
        if (values.length !== headers.length) continue;

        const result = {};
        headers.forEach((header, index) => {
            result[header] = values[index];
        });

        // Validate roll number
        if (result.roll_no && (result.roll_no.length !== 6 || isNaN(result.roll_no))) {
            throw new Error(`Invalid roll number "${result.roll_no}" on line ${i + 1}. Must be 6 digits.`);
        }

        // Set default values if not provided
        result.result_status = result.result_status || 'Pass';
        result.subjects = [];

        results.push(result);
    }

    // Insert results
    const resultsToInsert = results.map(result => ({
        ...result,
        subjects: result.subjects,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
        .from('results')
        .insert(resultsToInsert);

    if (error) throw error;

    return { count: results.length };
};

/**
 * Uploads complete results from a CSV file (student info with subjects and marks)
 * @param {Array<string>} headers - CSV headers
 * @param {Array<string>} lines - CSV lines
 * @returns {Promise<object>} Response object with count of uploaded results
 */
const uploadCompleteResultsFromCSV = async (headers, lines) => {
    // Group rows by student (roll_no and class_code)
    const studentGroups = {};

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim());
        if (values.length !== headers.length) continue;

        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index];
        });

        // Validate roll number
        if (row.roll_no && (row.roll_no.length !== 6 || isNaN(row.roll_no))) {
            throw new Error(`Invalid roll number "${row.roll_no}" on line ${i + 1}. Must be 6 digits.`);
        }

        // Create a unique key for each student
        const studentKey = `${row.roll_no}-${row.class_code}`;

        if (!studentGroups[studentKey]) {
            studentGroups[studentKey] = {
                student_name: row.student_name,
                roll_no: row.roll_no,
                class: row.class,
                class_code: row.class_code,
                result_status: row.result_status || 'Pass',
                grade: row.grade,
                subjects: []
            };
        }

        // Add subject if present
        if (row.subject && row.marks) {
            studentGroups[studentKey].subjects.push({
                name: row.subject,
                marks: parseInt(row.marks) || 0
            });
        }
    }

    // Convert to array
    const results = Object.values(studentGroups);

    // Insert results
    const resultsToInsert = results.map(result => ({
        ...result,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
        .from('results')
        .insert(resultsToInsert);

    if (error) throw error;

    return { count: results.length };
};

/**
 * Updates an existing result
 * @param {number} id - ID of the result to update
 * @param {object} resultData - Updated result data
 * @returns {Promise<object>} Response object with updated data
 */
export const updateResult = async (id, resultData) => {
    try {
        const resultToUpdate = {
            student_name: resultData.student_name,
            roll_no: resultData.roll_no,
            class: resultData.class,
            class_code: resultData.class_code,
            exam_type: resultData.exam_type, // Include exam_type
            result_status: resultData.result_status,
            grade: resultData.grade,
            subjects: resultData.subjects || [],
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('results')
            .update(resultToUpdate)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating result:', error.message);
        throw new Error('Failed to update result. Please try again.');
    }
};

/**
 * Deletes a result
 * @param {number} id - ID of the result to delete
 * @returns {Promise<object>} Response object
 */
export const deleteResult = async (id) => {
    try {
        const { error } = await supabase
            .from('results')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting result:', error.message);
        throw new Error('Failed to delete result. Please try again.');
    }
};

/**
 * Fetches all unique results by student (grouped by roll_no and class_code)
 * @returns {Promise<Array<object>>} Array of unique result objects
 */
export const getUniqueStudentResults = async () => {
    try {
        const { data, error } = await supabase
            .from('results')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Group results by roll number and class code to show unique students
        const uniqueStudents = [];
        const seen = new Set();

        if (data) {
            data.forEach(result => {
                const key = `${result.roll_no}-${result.class_code}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueStudents.push(result);
                }
            });
        }

        return uniqueStudents || [];
    } catch (error) {
        console.error('Error fetching unique results:', error.message);
        throw new Error('Failed to fetch unique results. Please try again.');
    }
};