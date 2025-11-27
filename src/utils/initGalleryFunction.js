// Utility function to initialize gallery structure in Supabase
// This can be called from the browser console or integrated into the admin panel

import { supabase } from "../services/supabaseService";

/**
 * Initializes the gallery structure in Supabase with default categories
 * @returns {Promise<Object>} Result object with success status and message
 */
export const initGalleryStructure = async () => {
    // Default gallery categories
    const defaultCategories = [
        "Classrooms",
        "Sports",
        "Events",
        "Infrastructure"
    ];

    try {
        // For each category, insert a placeholder record to ensure the category exists
        for (const category of defaultCategories) {
            // Check if category already exists
            const { data, error: fetchError } = await supabase
                .from('gallery')
                .select('*')
                .eq('category', category)
                .limit(1);

            // If no records exist for this category, create a placeholder
            if (!fetchError && (!data || data.length === 0)) {
                const { error: insertError } = await supabase
                    .from('gallery')
                    .insert([
                        {
                            category: category,
                            image_url: '',
                            image_name: 'placeholder',
                            uploaded_at: new Date().toISOString()
                        }
                    ]);

                if (insertError) {
                    console.error(`Error creating category ${category}:`, insertError);
                }
            }
        }

        console.log("Gallery structure initialized successfully");
        return {
            success: true,
            message: "Gallery structure initialized with categories: " + defaultCategories.join(", ")
        };
    } catch (error) {
        console.error("Error initializing gallery structure:", error);
        return {
            success: false,
            message: "Failed to initialize gallery structure: " + error.message
        };
    }
};

// Make it available globally for easy access from console
if (typeof window !== 'undefined') {
    window.initGalleryStructure = initGalleryStructure;
}

export default initGalleryStructure;