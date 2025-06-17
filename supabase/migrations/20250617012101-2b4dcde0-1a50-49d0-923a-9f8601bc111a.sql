
-- Update the plays table to match our application's data structure
ALTER TABLE public.plays 
  ADD COLUMN IF NOT EXISTS play_type text,
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users;

-- Enable Row Level Security
ALTER TABLE public.plays ENABLE ROW LEVEL SECURITY;

-- Create policies for users to manage their own plays
CREATE POLICY "Users can view all plays" 
  ON public.plays 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can insert their own plays" 
  ON public.plays 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plays" 
  ON public.plays 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plays" 
  ON public.plays 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);
