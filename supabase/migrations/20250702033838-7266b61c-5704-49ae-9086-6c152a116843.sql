-- Clear existing study data since we're changing the model
DELETE FROM study_sessions;

-- Drop existing foreign key constraints
ALTER TABLE study_sessions DROP CONSTRAINT IF EXISTS study_sessions_unit_id_fkey;
ALTER TABLE assignments DROP CONSTRAINT IF EXISTS assignments_unit_id_fkey;
ALTER TABLE assignments DROP CONSTRAINT IF EXISTS assignments_course_id_fkey;
ALTER TABLE flashcards DROP CONSTRAINT IF EXISTS flashcards_unit_id_fkey;
ALTER TABLE quiz_scores DROP CONSTRAINT IF EXISTS quiz_scores_unit_id_fkey;
ALTER TABLE saved_links DROP CONSTRAINT IF EXISTS saved_links_unit_id_fkey;
ALTER TABLE study_files DROP CONSTRAINT IF EXISTS study_files_unit_id_fkey;
ALTER TABLE study_goals DROP CONSTRAINT IF EXISTS study_goals_unit_id_fkey;

-- Update study_sessions table
ALTER TABLE study_sessions DROP COLUMN IF EXISTS unit_id;
ALTER TABLE study_sessions ADD COLUMN course_id uuid REFERENCES courses(id) ON DELETE CASCADE;

-- Update assignments table  
ALTER TABLE assignments DROP COLUMN IF EXISTS unit_id;
ALTER TABLE assignments ADD COLUMN assignment_course_id uuid REFERENCES courses(id) ON DELETE CASCADE;

-- Update other tables
ALTER TABLE flashcards DROP COLUMN IF EXISTS unit_id;
ALTER TABLE flashcards ADD COLUMN course_id uuid REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE quiz_scores DROP COLUMN IF EXISTS unit_id;
ALTER TABLE quiz_scores ADD COLUMN course_id uuid REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE saved_links DROP COLUMN IF EXISTS unit_id;
ALTER TABLE saved_links ADD COLUMN course_id uuid REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE study_files DROP COLUMN IF EXISTS unit_id;
ALTER TABLE study_files ADD COLUMN course_id uuid REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE study_goals DROP COLUMN IF EXISTS unit_id;
ALTER TABLE study_goals ADD COLUMN course_id uuid REFERENCES courses(id) ON DELETE CASCADE;

-- Add weekly_goal and color columns to courses table for study tracking
ALTER TABLE courses ADD COLUMN IF NOT EXISTS weekly_goal integer DEFAULT 8;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS color text DEFAULT '#3B82F6';