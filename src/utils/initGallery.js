// Script to initialize gallery structure in Supabase
// This should be run once to set up the initial gallery categories

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

/**
 * Initializes the gallery structure in Supabase with default categories
 */
const initGallery = async () => {
    // Default gallery categories - in Supabase, we'll create empty categories by inserting placeholder records
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

        console.log("Gallery structure initialized successfully!");
        console.log("Default categories created:", defaultCategories);
    } catch (error) {
        console.error("Error initializing gallery structure:", error);
    }
};

// Run the initialization
initGallery();