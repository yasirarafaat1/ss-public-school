-- Create the update_history table to track all changes
CREATE TABLE IF NOT EXISTS update_history (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_update_history_table_name ON update_history(table_name);
CREATE INDEX idx_update_history_record_id ON update_history(record_id);
CREATE INDEX idx_update_history_action ON update_history(action);
CREATE INDEX idx_update_history_updated_at ON update_history(updated_at);

-- Add a comment to the table
COMMENT ON TABLE update_history IS 'Tracks all changes to records in various tables with timestamps and user information';

-- Enable Row Level Security (RLS)
ALTER TABLE update_history ENABLE ROW LEVEL SECURITY;

-- Create policies for the update_history table
-- Allow authenticated users to read update_history
CREATE POLICY "Allow read access to authenticated users" ON update_history
FOR SELECT TO authenticated USING (true);

-- Allow admin users to insert update_history
CREATE POLICY "Allow insert access to admin users" ON update_history
FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to update update_history
CREATE POLICY "Allow update access to admin users" ON update_history
FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to delete update_history
CREATE POLICY "Allow delete access to admin users" ON update_history
FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Grant necessary permissions
GRANT ALL ON TABLE update_history TO authenticated;