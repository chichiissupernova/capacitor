
-- Fix missing tables and columns that the app is trying to use

-- First, let's ensure the feedback table has all required columns
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS feedback_type text;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS browser_info jsonb DEFAULT '{}'::jsonb;

-- Create the StorageService bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the avatars bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Update user_profiles table to ensure all required columns exist
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb;

-- Ensure RLS policies exist for user_profiles
DO $$ 
BEGIN
    -- Check if policies exist, if not create them
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can view their own profile') THEN
        CREATE POLICY "Users can view their own profile" ON public.user_profiles
        FOR SELECT USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can update their own profile') THEN
        CREATE POLICY "Users can update their own profile" ON public.user_profiles
        FOR UPDATE USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can insert their own profile') THEN
        CREATE POLICY "Users can insert their own profile" ON public.user_profiles
        FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Enable RLS on user_profiles if not already enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Ensure calendar_tasks has proper RLS policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_tasks' AND policyname = 'Users can view their own tasks') THEN
        CREATE POLICY "Users can view their own tasks" ON public.calendar_tasks
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_tasks' AND policyname = 'Users can insert their own tasks') THEN
        CREATE POLICY "Users can insert their own tasks" ON public.calendar_tasks
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_tasks' AND policyname = 'Users can update their own tasks') THEN
        CREATE POLICY "Users can update their own tasks" ON public.calendar_tasks
        FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_tasks' AND policyname = 'Users can delete their own tasks') THEN
        CREATE POLICY "Users can delete their own tasks" ON public.calendar_tasks
        FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Enable RLS on calendar_tasks if not already enabled
ALTER TABLE public.calendar_tasks ENABLE ROW LEVEL SECURITY;

-- Ensure task_completions has proper RLS policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'task_completions' AND policyname = 'Users can view their own completions') THEN
        CREATE POLICY "Users can view their own completions" ON public.task_completions
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'task_completions' AND policyname = 'Users can insert their own completions') THEN
        CREATE POLICY "Users can insert their own completions" ON public.task_completions
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Enable RLS on task_completions if not already enabled
ALTER TABLE public.task_completions ENABLE ROW LEVEL SECURITY;

-- Ensure activity_logs has proper RLS policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_logs' AND policyname = 'Users can view their own activities') THEN
        CREATE POLICY "Users can view their own activities" ON public.activity_logs
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_logs' AND policyname = 'Users can insert their own activities') THEN
        CREATE POLICY "Users can insert their own activities" ON public.activity_logs
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Enable RLS on activity_logs if not already enabled
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
