-- Add viral prediction columns to scripts table
ALTER TABLE scripts 
ADD COLUMN IF NOT EXISTS viral_score INTEGER CHECK (viral_score >= 0 AND viral_score <= 100),
ADD COLUMN IF NOT EXISTS viral_analysis TEXT;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
