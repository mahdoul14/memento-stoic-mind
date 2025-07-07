
-- First, let's clean up any existing duplicate profiles and fix the table structure
DELETE FROM public.profiles 
WHERE id NOT IN (
  SELECT MIN(id) 
  FROM public.profiles 
  GROUP BY user_id
);

-- Add a unique constraint on user_id to prevent duplicates
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);

-- Also make user_id NOT NULL since it's required
ALTER TABLE public.profiles 
ALTER COLUMN user_id SET NOT NULL;
