-- Add status column to staff table
ALTER TABLE staff ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave'));

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
CREATE INDEX IF NOT EXISTS idx_update_history_table_name ON update_history(table_name);
CREATE INDEX IF NOT EXISTS idx_update_history_record_id ON update_history(record_id);
CREATE INDEX IF NOT EXISTS idx_update_history_action ON update_history(action);
CREATE INDEX IF NOT EXISTS idx_update_history_updated_at ON update_history(updated_at);

-- Add a comment to the table
COMMENT ON TABLE update_history IS 'Tracks all changes to records in various tables with timestamps and user information';

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE update_history ENABLE ROW LEVEL SECURITY;

-- Create policies for the update_history table
-- Allow authenticated users to read update_history
CREATE POLICY IF NOT EXISTS "Allow read access to authenticated users" ON update_history
FOR SELECT TO authenticated USING (true);

-- Allow admin users to insert update_history
CREATE POLICY IF NOT EXISTS "Allow insert access to admin users" ON update_history
FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to update update_history
CREATE POLICY IF NOT EXISTS "Allow update access to admin users" ON update_history
FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Allow admin users to delete update_history
CREATE POLICY IF NOT EXISTS "Allow delete access to admin users" ON update_history
FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@school.edu'  -- Replace with actual admin email
    )
);

-- Grant necessary permissions
GRANT ALL ON TABLE update_history TO authenticated;

-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
CREATE TRIGGER update_classes_updated_at 
BEFORE UPDATE ON classes 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at 
BEFORE UPDATE ON sessions 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at 
BEFORE UPDATE ON students 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
CREATE TRIGGER update_staff_updated_at 
BEFORE UPDATE ON staff 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_student_classes_updated_at ON student_classes;
CREATE TRIGGER update_student_classes_updated_at 
BEFORE UPDATE ON student_classes 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_results_updated_at ON results;
CREATE TRIGGER update_results_updated_at 
BEFORE UPDATE ON results 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to log changes to update_history table
CREATE OR REPLACE FUNCTION log_update_history() 
RETURNS TRIGGER AS $$
DECLARE
    old_row JSONB;
    new_row JSONB;
BEGIN
    -- Get the table name
    CASE TG_TABLE_NAME
        WHEN 'students' THEN
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
        WHEN 'staff' THEN
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
        WHEN 'classes' THEN
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
        WHEN 'sessions' THEN
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
        WHEN 'student_classes' THEN
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
        WHEN 'results' THEN
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

-- Create triggers for all tables to log changes
DROP TRIGGER IF EXISTS log_students_changes ON students;
CREATE TRIGGER log_students_changes
AFTER INSERT OR UPDATE OR DELETE ON students
FOR EACH ROW EXECUTE FUNCTION log_update_history();

DROP TRIGGER IF EXISTS log_staff_changes ON staff;
CREATE TRIGGER log_staff_changes
AFTER INSERT OR UPDATE OR DELETE ON staff
FOR EACH ROW EXECUTE FUNCTION log_update_history();

DROP TRIGGER IF EXISTS log_classes_changes ON classes;
CREATE TRIGGER log_classes_changes
AFTER INSERT OR UPDATE OR DELETE ON classes
FOR EACH ROW EXECUTE FUNCTION log_update_history();

DROP TRIGGER IF EXISTS log_sessions_changes ON sessions;
CREATE TRIGGER log_sessions_changes
AFTER INSERT OR UPDATE OR DELETE ON sessions
FOR EACH ROW EXECUTE FUNCTION log_update_history();

DROP TRIGGER IF EXISTS log_student_classes_changes ON student_classes;
CREATE TRIGGER log_student_classes_changes
AFTER INSERT OR UPDATE OR DELETE ON student_classes
FOR EACH ROW EXECUTE FUNCTION log_update_history();

DROP TRIGGER IF EXISTS log_results_changes ON results;
CREATE TRIGGER log_results_changes
AFTER INSERT OR UPDATE OR DELETE ON results
FOR EACH ROW EXECUTE FUNCTION log_update_history();