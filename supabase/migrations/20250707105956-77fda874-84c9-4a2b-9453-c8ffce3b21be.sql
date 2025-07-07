
-- Enable Row Level Security on journal_entries table
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own journal entries
CREATE POLICY "Users can view their own journal entries" 
  ON public.journal_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own journal entries
CREATE POLICY "Users can create their own journal entries" 
  ON public.journal_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own journal entries
CREATE POLICY "Users can update their own journal entries" 
  ON public.journal_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own journal entries
CREATE POLICY "Users can delete their own journal entries" 
  ON public.journal_entries 
  FOR DELETE 
  USING (auth.uid() = user_id);
