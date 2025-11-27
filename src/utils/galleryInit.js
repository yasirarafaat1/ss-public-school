// Utility script to initialize gallery structure in Supabase
import { supabase } from "../services/supabaseService";

/**
 * Initializes the gallery structure in Supabase with default categories
 * Run this once to set up the initial gallery structure
 */
export const initializeGalleryStructure = async () => {
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
        return { success: true };
    } catch (error) {
        console.error("Error initializing gallery structure:", error);
        return { success: false, error: error.message };
    }
};

export default initializeGalleryStructure;