
-- Create table for storing course files
CREATE TABLE public.course_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for course_files
ALTER TABLE public.course_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own course files" ON public.course_files
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own course files" ON public.course_files
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own course files" ON public.course_files
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own course files" ON public.course_files
FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for course files
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-files', 'course-files', true);

-- Create storage policies for course files
CREATE POLICY "Users can upload course files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'course-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view course files" ON storage.objects
FOR SELECT USING (bucket_id = 'course-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update course files" ON storage.objects
FOR UPDATE USING (bucket_id = 'course-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete course files" ON storage.objects
FOR DELETE USING (bucket_id = 'course-files' AND auth.uid()::text = (storage.foldername(name))[1]);
