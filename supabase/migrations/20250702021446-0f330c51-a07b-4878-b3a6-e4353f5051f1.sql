
-- Create notifications table for system alerts
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  read BOOLEAN DEFAULT false,
  related_table TEXT, -- For linking to assignments, units, etc.
  related_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can view own notifications') THEN
        CREATE POLICY "Users can view own notifications" 
          ON public.notifications 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can create own notifications') THEN
        CREATE POLICY "Users can create own notifications" 
          ON public.notifications 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can update own notifications') THEN
        CREATE POLICY "Users can update own notifications" 
          ON public.notifications 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can delete own notifications') THEN
        CREATE POLICY "Users can delete own notifications" 
          ON public.notifications 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create courses table for comprehensive course management
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  semester TEXT,
  year INTEGER,
  credits INTEGER DEFAULT 3,
  instructor TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on courses table
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for courses
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'courses' AND policyname = 'Users can view own courses') THEN
        CREATE POLICY "Users can view own courses" 
          ON public.courses 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'courses' AND policyname = 'Users can create own courses') THEN
        CREATE POLICY "Users can create own courses" 
          ON public.courses 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'courses' AND policyname = 'Users can update own courses') THEN
        CREATE POLICY "Users can update own courses" 
          ON public.courses 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'courses' AND policyname = 'Users can delete own courses') THEN
        CREATE POLICY "Users can delete own courses" 
          ON public.courses 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Add course_id to study_units table to link units to courses
ALTER TABLE public.study_units 
ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id);

-- Add course_id to assignments table 
ALTER TABLE public.assignments 
ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id);

-- Create exam schedules table
CREATE TABLE IF NOT EXISTS public.exam_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES public.courses(id) NOT NULL,
  title TEXT NOT NULL,
  exam_type TEXT NOT NULL DEFAULT 'CAT' CHECK (exam_type IN ('CAT', 'Final', 'Midterm', 'Quiz')),
  exam_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 120,
  location TEXT,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on exam_schedules table
ALTER TABLE public.exam_schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for exam_schedules
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exam_schedules' AND policyname = 'Users can view own exam schedules') THEN
        CREATE POLICY "Users can view own exam schedules" 
          ON public.exam_schedules 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exam_schedules' AND policyname = 'Users can create own exam schedules') THEN
        CREATE POLICY "Users can create own exam schedules" 
          ON public.exam_schedules 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exam_schedules' AND policyname = 'Users can update own exam schedules') THEN
        CREATE POLICY "Users can update own exam schedules" 
          ON public.exam_schedules 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exam_schedules' AND policyname = 'Users can delete own exam schedules') THEN
        CREATE POLICY "Users can delete own exam schedules" 
          ON public.exam_schedules 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Add is_lagging flag to study_units to track lagging status
ALTER TABLE public.study_units 
ADD COLUMN IF NOT EXISTS is_lagging BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS lagging_hours NUMERIC DEFAULT 0;

-- Add theme preference to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'system'));

-- Add weekly progress tracking
CREATE TABLE IF NOT EXISTS public.weekly_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  week_number INTEGER NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_hours NUMERIC DEFAULT 0,
  goals_met INTEGER DEFAULT 0,
  total_goals INTEGER DEFAULT 0,
  summary TEXT,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_number)
);

-- Enable RLS on weekly_progress table
ALTER TABLE public.weekly_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for weekly_progress
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'weekly_progress' AND policyname = 'Users can view own weekly progress') THEN
        CREATE POLICY "Users can view own weekly progress" 
          ON public.weekly_progress 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'weekly_progress' AND policyname = 'Users can create own weekly progress') THEN
        CREATE POLICY "Users can create own weekly progress" 
          ON public.weekly_progress 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'weekly_progress' AND policyname = 'Users can update own weekly progress') THEN
        CREATE POLICY "Users can update own weekly progress" 
          ON public.weekly_progress 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create function to generate notifications for due assignments
CREATE OR REPLACE FUNCTION public.generate_assignment_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert notifications for assignments due tomorrow
  INSERT INTO public.notifications (user_id, title, message, type, related_table, related_id)
  SELECT 
    a.user_id,
    'Assignment Due Tomorrow',
    'Assignment "' || a.title || '" is due tomorrow (' || DATE(a.due_date) || ')',
    'warning',
    'assignments',
    a.id::text
  FROM public.assignments a
  WHERE 
    DATE(a.due_date) = CURRENT_DATE + INTERVAL '1 day'
    AND a.completed = false
    AND NOT EXISTS (
      SELECT 1 FROM public.notifications n 
      WHERE n.user_id = a.user_id 
      AND n.related_table = 'assignments' 
      AND n.related_id = a.id::text 
      AND DATE(n.created_at) = CURRENT_DATE
    );
END;
$$;

-- Create function to check lagging units and generate notifications
CREATE OR REPLACE FUNCTION public.check_lagging_units()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mark units as lagging if they're behind weekly goals
  UPDATE public.study_units 
  SET is_lagging = true,
      lagging_hours = GREATEST(weekly_goal - (
        SELECT COALESCE(SUM(duration), 0) / 60.0
        FROM public.study_sessions s
        WHERE s.unit_id = study_units.id
        AND s.date >= date_trunc('week', CURRENT_DATE)
      ), 0)
  WHERE weekly_goal > (
    SELECT COALESCE(SUM(duration), 0) / 60.0
    FROM public.study_sessions s
    WHERE s.unit_id = study_units.id
    AND s.date >= date_trunc('week', CURRENT_DATE)
  );
  
  -- Generate notifications for lagging units
  INSERT INTO public.notifications (user_id, title, message, type, related_table, related_id)
  SELECT 
    su.user_id,
    'Unit Behind Schedule',
    'You are behind on "' || su.name || '". Need ' || ROUND(su.lagging_hours, 1) || ' more hours this week.',
    'warning',
    'study_units',
    su.id::text
  FROM public.study_units su
  WHERE 
    su.is_lagging = true
    AND NOT EXISTS (
      SELECT 1 FROM public.notifications n 
      WHERE n.user_id = su.user_id 
      AND n.related_table = 'study_units' 
      AND n.related_id = su.id::text 
      AND DATE(n.created_at) = CURRENT_DATE
    );
END;
$$;
