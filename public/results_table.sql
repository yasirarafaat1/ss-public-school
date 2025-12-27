-- Create the results table
CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    roll_no VARCHAR(6) NOT NULL,
    class VARCHAR(50) NOT NULL,
    class_code VARCHAR(50) NOT NULL,
    result_status VARCHAR(10) DEFAULT 'Pass' CHECK (result_status IN ('Pass', 'Fail')),
    grade VARCHAR(10) NOT NULL,
    subjects JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_results_roll_no ON results(roll_no);
CREATE INDEX idx_results_class_code ON results(class_code);
CREATE INDEX idx_results_roll_class ON results(roll_no, class_code);

-- Add a comment to the table
COMMENT ON TABLE results IS 'Stores student results information including personal details, class information, and subject marks';

-- Enable Row Level Security (RLS)
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Create policies for the results table
-- Allow authenticated users to read results
CREATE POLICY "Allow read access to authenticated users" ON results
FOR SELECT TO authenticated USING (true);

-- Allow admin users to insert results
CREATE POLICY "Allow insert access to admin users" ON results
FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to update results
CREATE POLICY "Allow update access to admin users" ON results
FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to delete results
CREATE POLICY "Allow delete access to admin users" ON results
FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Grant necessary permissions
GRANT ALL ON TABLE results TO authenticated;