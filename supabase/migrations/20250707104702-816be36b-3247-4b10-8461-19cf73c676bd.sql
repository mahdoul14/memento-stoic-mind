
-- First, let's check if we need to modify the existing virtue_tracker table
-- Update the table structure to ensure proper constraints and defaults
ALTER TABLE public.virtue_tracker 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT gen_random_uuid(),
ALTER COLUMN created_at SET DEFAULT now();

-- Add Row Level Security (RLS) to ensure users can only see their own virtue tracker entries
ALTER TABLE public.virtue_tracker ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own virtue tracker entries
CREATE POLICY "Users can view their own virtue tracker entries" 
  ON public.virtue_tracker 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own virtue tracker entries
CREATE POLICY "Users can create their own virtue tracker entries" 
  ON public.virtue_tracker 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own virtue tracker entries
CREATE POLICY "Users can update their own virtue tracker entries" 
  ON public.virtue_tracker 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own virtue tracker entries
CREATE POLICY "Users can delete their own virtue tracker entries" 
  ON public.virtue_tracker 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a unique constraint to prevent duplicate entries for the same user, virtue, and date
ALTER TABLE public.virtue_tracker 
ADD CONSTRAINT unique_user_virtue_date 
UNIQUE (user_id, virtue, date);
