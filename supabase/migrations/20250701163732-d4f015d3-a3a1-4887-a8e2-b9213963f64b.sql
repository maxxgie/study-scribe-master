
-- Create comprehensive database schema for the study planner app

-- Users table for authentication (profiles)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Study units table
CREATE TABLE public.study_units (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  weekly_goal INTEGER DEFAULT 8,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Study sessions table (enhanced)
CREATE TABLE public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  unit_id INTEGER REFERENCES public.study_units(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL, -- in minutes
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  subtopic TEXT,
  confidence_rating INTEGER CHECK (confidence_rating >= 1 AND confidence_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Assignments table
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  unit_id INTEGER REFERENCES public.study_units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Study files table
CREATE TABLE public.study_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  unit_id INTEGER REFERENCES public.study_units(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  searchable_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quiz scores table
CREATE TABLE public.quiz_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  unit_id INTEGER REFERENCES public.study_units(id) ON DELETE CASCADE,
  score DECIMAL(5,2) NOT NULL,
  max_score DECIMAL(5,2) NOT NULL,
  quiz_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  quiz_topic TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Flashcards table
CREATE TABLE public.flashcards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  unit_id INTEGER REFERENCES public.study_units(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
  next_review TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() + INTERVAL '1 day',
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Saved links table
CREATE TABLE public.saved_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  unit_id INTEGER REFERENCES public.study_units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Study goals table
CREATE TABLE public.study_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  unit_id INTEGER REFERENCES public.study_units(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('weekly', 'monthly', 'exam_prep')),
  target_hours DECIMAL(5,2) NOT NULL,
  current_hours DECIMAL(5,2) DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  achieved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Time preferences table
CREATE TABLE public.time_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  preference_type TEXT DEFAULT 'available' CHECK (preference_type IN ('available', 'peak', 'low_energy')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for study_units
CREATE POLICY "Users can view own units" ON public.study_units FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own units" ON public.study_units FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own units" ON public.study_units FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own units" ON public.study_units FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for study_sessions
CREATE POLICY "Users can view own sessions" ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.study_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON public.study_sessions FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for assignments
CREATE POLICY "Users can view own assignments" ON public.assignments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own assignments" ON public.assignments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assignments" ON public.assignments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own assignments" ON public.assignments FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for study_files
CREATE POLICY "Users can view own files" ON public.study_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own files" ON public.study_files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own files" ON public.study_files FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own files" ON public.study_files FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for quiz_scores
CREATE POLICY "Users can view own quiz scores" ON public.quiz_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own quiz scores" ON public.quiz_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quiz scores" ON public.quiz_scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quiz scores" ON public.quiz_scores FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for flashcards
CREATE POLICY "Users can view own flashcards" ON public.flashcards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own flashcards" ON public.flashcards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flashcards" ON public.flashcards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own flashcards" ON public.flashcards FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for saved_links
CREATE POLICY "Users can view own links" ON public.saved_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own links" ON public.saved_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own links" ON public.saved_links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own links" ON public.saved_links FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for study_goals
CREATE POLICY "Users can view own goals" ON public.study_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own goals" ON public.study_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.study_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.study_goals FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for time_preferences
CREATE POLICY "Users can view own time preferences" ON public.time_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own time preferences" ON public.time_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own time preferences" ON public.time_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own time preferences" ON public.time_preferences FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  -- Create default study units for the new user
  INSERT INTO public.study_units (user_id, name, color, weekly_goal) VALUES
    (new.id, 'Digital Logic and Design', '#3B82F6', 8),
    (new.id, 'System Analysis and Design', '#8B5CF6', 8),
    (new.id, 'Database Systems and Design', '#10B981', 8),
    (new.id, 'General Skills and Communications', '#F59E0B', 6),
    (new.id, 'Probability and Statistics', '#EF4444', 8),
    (new.id, 'Algorithm Design and Analysis', '#06B6D4', 8),
    (new.id, 'Programming Languages', '#84CC16', 8),
    (new.id, 'Operating Systems', '#F97316', 8);
  
  -- Create default time preferences
  INSERT INTO public.time_preferences (user_id, day_of_week, start_time, end_time, preference_type) VALUES
    -- Weekdays (Monday-Friday) 3am-7am
    (new.id, 1, '03:00', '07:00', 'available'),
    (new.id, 2, '03:00', '07:00', 'available'),
    (new.id, 3, '03:00', '07:00', 'available'),
    (new.id, 4, '03:00', '07:00', 'available'),
    (new.id, 5, '03:00', '07:00', 'available'),
    -- Weekdays (Monday-Friday) 5pm-8pm
    (new.id, 1, '17:00', '20:00', 'available'),
    (new.id, 2, '17:00', '20:00', 'available'),
    (new.id, 3, '17:00', '20:00', 'available'),
    (new.id, 4, '17:00', '20:00', 'available'),
    (new.id, 5, '17:00', '20:00', 'available'),
    -- Saturday 6am-11am
    (new.id, 6, '06:00', '11:00', 'available'),
    -- Saturday 2pm-5pm
    (new.id, 6, '14:00', '17:00', 'available'),
    -- Sunday 6am-11am
    (new.id, 0, '06:00', '11:00', 'available');
  
  RETURN new;
END;
$$;

-- Create trigger to handle new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable realtime for key tables
ALTER TABLE public.study_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.assignments REPLICA IDENTITY FULL;
ALTER TABLE public.study_goals REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_goals;
