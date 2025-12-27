-- Create the classes table
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    class_number VARCHAR(10) NOT NULL UNIQUE,  -- Roman numerals like Ist, IInd, IIIrd, etc.
    class_code VARCHAR(10) NOT NULL UNIQUE,    -- Format like A101, B305, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    start_year INTEGER NOT NULL,
    start_month INTEGER NOT NULL CHECK (start_month BETWEEN 1 AND 12),
    end_year INTEGER NOT NULL,
    end_month INTEGER NOT NULL CHECK (end_month BETWEEN 1 AND 12),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    mother_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    mobile_number VARCHAR(15),
    email VARCHAR(255),
    registration_number VARCHAR(50) UNIQUE,
    image_url TEXT,
    registration_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the student_classes table (junction table for many-to-many relationship)
CREATE TABLE IF NOT EXISTS student_classes (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
    roll_number VARCHAR(6) NOT NULL,  -- 6-digit roll number
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, class_id, session_id),  -- Ensure one student per class per session
    UNIQUE(student_id, session_id)  -- Ensure one class per student per session
);

-- Create indexes for better query performance
CREATE INDEX idx_classes_class_number ON classes(class_number);
CREATE INDEX idx_classes_class_code ON classes(class_code);
CREATE INDEX idx_students_registration_number ON students(registration_number);
CREATE INDEX idx_student_classes_student_id ON student_classes(student_id);
CREATE INDEX idx_student_classes_class_id ON student_classes(class_id);
CREATE INDEX idx_student_classes_session_id ON student_classes(session_id);
CREATE INDEX idx_student_classes_roll_number ON student_classes(roll_number);

-- Add comments to the tables
COMMENT ON TABLE classes IS 'Stores class information with Roman numeral class numbers and alphanumeric class codes';
COMMENT ON TABLE sessions IS 'Stores academic session years';
COMMENT ON TABLE students IS 'Stores student personal information';
COMMENT ON TABLE student_classes IS 'Junction table linking students to classes for specific sessions with roll numbers';

-- Enable Row Level Security (RLS)
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_classes ENABLE ROW LEVEL SECURITY;

-- Create policies for the classes table
-- Allow authenticated users to read classes
CREATE POLICY "Allow read access to authenticated users" ON classes
FOR SELECT TO authenticated USING (true);

-- Allow admin users to insert classes
CREATE POLICY "Allow insert access to admin users" ON classes
FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to update classes
CREATE POLICY "Allow update access to admin users" ON classes
FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to delete classes
CREATE POLICY "Allow delete access to admin users" ON classes
FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Create policies for the sessions table
-- Allow authenticated users to read sessions
CREATE POLICY "Allow read access to authenticated users" ON sessions
FOR SELECT TO authenticated USING (true);

-- Allow admin users to insert sessions
CREATE POLICY "Allow insert access to admin users" ON sessions
FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to update sessions
CREATE POLICY "Allow update access to admin users" ON sessions
FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to delete sessions
CREATE POLICY "Allow delete access to admin users" ON sessions
FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Create policies for the students table
-- Allow authenticated users to read students
CREATE POLICY "Allow read access to authenticated users" ON students
FOR SELECT TO authenticated USING (true);

-- Allow admin users to insert students
CREATE POLICY "Allow insert access to admin users" ON students
FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to update students
CREATE POLICY "Allow update access to admin users" ON students
FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to delete students
CREATE POLICY "Allow delete access to admin users" ON students
FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Create policies for the student_classes table
-- Allow authenticated users to read student_classes
CREATE POLICY "Allow read access to authenticated users" ON student_classes
FOR SELECT TO authenticated USING (true);

-- Allow admin users to insert student_classes
CREATE POLICY "Allow insert access to admin users" ON student_classes
FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to update student_classes
CREATE POLICY "Allow update access to admin users" ON student_classes
FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to delete student_classes
CREATE POLICY "Allow delete access to admin users" ON student_classes
FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Grant necessary permissions
GRANT ALL ON TABLE classes TO authenticated;
GRANT ALL ON TABLE sessions TO authenticated;
GRANT ALL ON TABLE students TO authenticated;
GRANT ALL ON TABLE student_classes TO authenticated;