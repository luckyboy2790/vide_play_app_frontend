
-- Make formation and thumbnail_url columns nullable in the plays table
ALTER TABLE public.plays 
  ALTER COLUMN formation DROP NOT NULL,
  ALTER COLUMN thumbnail_url DROP NOT NULL;
