
-- Create storage bucket for assignment files
INSERT INTO storage.buckets (id, name, public)
VALUES ('assignment-files', 'assignment-files', true);

-- Create storage policies for assignment files
CREATE POLICY "Users can upload assignment files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'assignment-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view assignment files" ON storage.objects
FOR SELECT USING (bucket_id = 'assignment-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update assignment files" ON storage.objects
FOR UPDATE USING (bucket_id = 'assignment-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete assignment files" ON storage.objects
FOR DELETE USING (bucket_id = 'assignment-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add attachment_url column to assignments table for file storage
ALTER TABLE public.assignments 
ADD COLUMN attachment_url TEXT;

-- Create table for storing multiple assignment files
CREATE TABLE public.assignment_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for assignment_files
ALTER TABLE public.assignment_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assignment files" ON public.assignment_files
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assignment files" ON public.assignment_files
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assignment files" ON public.assignment_files
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assignment files" ON public.assignment_files
FOR DELETE USING (auth.uid() = user_id);
