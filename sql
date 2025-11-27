-- For fee_structure table
-- First, disable any existing policies
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON "fee_structure";
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON "fee_structure";
DROP POLICY IF EXISTS "Allow update for authenticated users" ON "fee_structure";
DROP POLICY IF EXISTS "Allow select for authenticated users" ON "fee_structure";

-- Create new policies for authenticated users (admins)
CREATE POLICY "Allow select for authenticated users" ON "fee_structure"
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users" ON "fee_structure"
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON "fee_structure"
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for authenticated users" ON "fee_structure"
FOR DELETE TO authenticated USING (true);

-- Enable RLS on the table
ALTER TABLE "fee_structure" ENABLE ROW LEVEL SECURITY;

-- For important_dates table
-- First, disable any existing policies
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON "important_dates";
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON "important_dates";
DROP POLICY IF EXISTS "Allow update for authenticated users" ON "important_dates";
DROP POLICY IF EXISTS "Allow select for authenticated users" ON "important_dates";

-- Create new policies for authenticated users (admins)
CREATE POLICY "Allow select for authenticated users" ON "important_dates"
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users" ON "important_dates"
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON "important_dates"
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for authenticated users" ON "important_dates"
FOR DELETE TO authenticated USING (true);

-- Enable RLS on the table
ALTER TABLE "important_dates" ENABLE ROW LEVEL SECURITY;