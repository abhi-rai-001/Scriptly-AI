ALTER TABLE public.scripts
ADD COLUMN IF NOT EXISTS status text;

UPDATE public.scripts
SET status = 'ready'
WHERE status IS NULL;

ALTER TABLE public.scripts
ALTER COLUMN status SET DEFAULT 'draft';

ALTER TABLE public.scripts
ALTER COLUMN status SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'scripts_status_check'
  ) THEN
    ALTER TABLE public.scripts
    ADD CONSTRAINT scripts_status_check
    CHECK (status IN ('draft', 'ready', 'published'));
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
