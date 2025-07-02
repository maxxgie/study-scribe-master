-- Update study_sessions to reference courses instead of study_units
ALTER TABLE study_sessions DROP CONSTRAINT IF EXISTS study_sessions_unit_id_fkey;
ALTER TABLE study_sessions RENAME COLUMN unit_id TO course_id;
ALTER TABLE study_sessions ALTER COLUMN course_id TYPE uuid USING course_id::text::uuid;
ALTER TABLE study_sessions ADD CONSTRAINT study_sessions_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- Update assignments to reference courses instead of study_units  
ALTER TABLE assignments DROP CONSTRAINT IF EXISTS assignments_unit_id_fkey;
ALTER TABLE assignments RENAME COLUMN unit_id TO assignment_course_id;
ALTER TABLE assignments ALTER COLUMN assignment_course_id TYPE uuid USING assignment_course_id::text::uuid;
ALTER TABLE assignments ADD CONSTRAINT assignments_course_id_fkey 
  FOREIGN KEY (assignment_course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- Update other tables that reference study_units to reference courses
ALTER TABLE flashcards DROP CONSTRAINT IF EXISTS flashcards_unit_id_fkey;
ALTER TABLE flashcards RENAME COLUMN unit_id TO course_id;
ALTER TABLE flashcards ALTER COLUMN course_id TYPE uuid USING course_id::text::uuid;
ALTER TABLE flashcards ADD CONSTRAINT flashcards_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE quiz_scores DROP CONSTRAINT IF EXISTS quiz_scores_unit_id_fkey;
ALTER TABLE quiz_scores RENAME COLUMN unit_id TO course_id;
ALTER TABLE quiz_scores ALTER COLUMN course_id TYPE uuid USING course_id::text::uuid;
ALTER TABLE quiz_scores ADD CONSTRAINT quiz_scores_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE saved_links DROP CONSTRAINT IF EXISTS saved_links_unit_id_fkey;
ALTER TABLE saved_links RENAME COLUMN unit_id TO course_id;
ALTER TABLE saved_links ALTER COLUMN course_id TYPE uuid USING course_id::text::uuid;
ALTER TABLE saved_links ADD CONSTRAINT saved_links_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE study_files DROP CONSTRAINT IF EXISTS study_files_unit_id_fkey;
ALTER TABLE study_files RENAME COLUMN unit_id TO course_id;
ALTER TABLE study_files ALTER COLUMN course_id TYPE uuid USING course_id::text::uuid;
ALTER TABLE study_files ADD CONSTRAINT study_files_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE study_goals DROP CONSTRAINT IF EXISTS study_goals_unit_id_fkey;
ALTER TABLE study_goals RENAME COLUMN unit_id TO course_id;
ALTER TABLE study_goals ALTER COLUMN course_id TYPE uuid USING course_id::text::uuid;
ALTER TABLE study_goals ADD CONSTRAINT study_goals_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- Add weekly_goal and color columns to courses table for study tracking
ALTER TABLE courses ADD COLUMN weekly_goal integer DEFAULT 8;
ALTER TABLE courses ADD COLUMN color text DEFAULT '#3B82F6';

-- Update the handle_new_user function to not create default study units
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
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
$function$;