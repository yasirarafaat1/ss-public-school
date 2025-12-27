-- Create the fees table to store student fee records
CREATE TABLE IF NOT EXISTS fees (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
    roll_number VARCHAR(6) NOT NULL,
    month VARCHAR(20) NOT NULL,  -- Month name like 'January', 'February', etc.
    year INTEGER NOT NULL,      -- Year like 2024, 2025, etc.
    amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    due_amount DECIMAL(10, 2) GENERATED ALWAYS AS (amount - paid_amount) STORED,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'overdue')),
    payment_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_fees_student_id ON fees(student_id);
CREATE INDEX idx_fees_class_id ON fees(class_id);
CREATE INDEX idx_fees_session_id ON fees(session_id);
CREATE INDEX idx_fees_roll_number ON fees(roll_number);
CREATE INDEX idx_fees_month_year ON fees(month, year);
CREATE INDEX idx_fees_status ON fees(status);

-- Add comments to the table
COMMENT ON TABLE fees IS 'Stores fee records for students with monthly breakdown';

-- Enable Row Level Security (RLS)
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;

-- Create policies for the fees table
-- Allow authenticated users to read fees
CREATE POLICY "Allow read access to authenticated users" ON fees
FOR SELECT TO authenticated USING (true);

-- Allow admin users to insert fees
CREATE POLICY "Allow insert access to admin users" ON fees
FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to update fees
CREATE POLICY "Allow update access to admin users" ON fees
FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to delete fees
CREATE POLICY "Allow delete access to admin users" ON fees
FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Grant necessary permissions
GRANT ALL ON TABLE fees TO authenticated;

-- Create trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_fees_updated_at ON fees;
CREATE TRIGGER update_fees_updated_at 
BEFORE UPDATE ON fees 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to log changes to update_history table for fees
CREATE OR REPLACE FUNCTION log_fees_changes() 
RETURNS TRIGGER AS $$
DECLARE
    old_row JSONB;
    new_row JSONB;
BEGIN
    -- Get the table name
    CASE TG_TABLE_NAME
        WHEN 'fees' THEN
            IF (TG_OP = 'DELETE') THEN
                old_row := to_jsonb(OLD);
                INSERT INTO update_history (table_name, record_id, action, old_values, updated_by)
                VALUES (TG_TABLE_NAME, OLD.id, TG_OP, old_row, current_user);
                RETURN OLD;
            ELSIF (TG_OP = 'INSERT') THEN
                new_row := to_jsonb(NEW);
                INSERT INTO update_history (table_name, record_id, action, new_values, updated_by)
                VALUES (TG_TABLE_NAME, NEW.id, TG_OP, new_row, current_user);
                RETURN NEW;
            ELSIF (TG_OP = 'UPDATE') THEN
                old_row := to_jsonb(OLD);
                new_row := to_jsonb(NEW);
                INSERT INTO update_history (table_name, record_id, action, old_values, new_values, updated_by)
                VALUES (TG_TABLE_NAME, NEW.id, TG_OP, old_row, new_row, current_user);
                RETURN NEW;
            END IF;
    END CASE;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for fees table to log changes
DROP TRIGGER IF EXISTS log_fees_changes ON fees;
CREATE TRIGGER log_fees_changes
AFTER INSERT OR UPDATE OR DELETE ON fees
FOR EACH ROW EXECUTE FUNCTION log_fees_changes();