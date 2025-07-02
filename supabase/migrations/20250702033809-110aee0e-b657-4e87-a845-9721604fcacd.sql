-- First, safely handle the data transformation by clearing existing data that references study_units
-- Since we're changing the entire model, we'll clear the existing study sessions and related data

-- Clear existing data that references study_units
DELETE FROM study_sessions;
DELETE FROM assignments WHERE unit_id IS NOT NULL;
DELETE FROM flashcards WHERE unit_id IS NOT NULL;
DELETE FROM quiz_scores WHERE unit_id IS NOT NULL;
DELETE FROM saved_links WHERE unit_id IS NOT NULL;
DELETE FROM study_files WHERE unit_id IS NOT NULL;
DELETE FROM study_goals WHERE unit_id IS NOT NULL;

-- Now update the schema safely
ALTER TABLE study_sessions DROP CONSTRAINT IF EXISTS study_sessions_unit_id_fkey;
ALTER TABLE study_sessions RENAME COLUMN unit_id TO course_id;
ALTER TABLE study_sessions ALTER COLUMN course_id TYPE uuid USING NULL;
ALTER TABLE study_sessions ADD CONSTRAINT study_sessions_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- Update assignments to reference courses instead of study_units  
ALTER TABLE assignments DROP CONSTRAINT IF EXISTS assignments_unit_id_fkey;
ALTER TABLE assignments RENAME COLUMN unit_id TO assignment_course_id;
ALTER TABLE assignments ALTER COLUMN assignment_course_id TYPE uuid USING NULL;
ALTER TABLE assignments ADD CONSTRAINT assignments_course_id_fkey 
  FOREIGN KEY (assignment_course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- Update other tables that reference study_units to reference courses
ALTER TABLE flashcards DROP CONSTRAINT IF EXISTS flashcards_unit_id_fkey;
ALTER TABLE flashcards RENAME COLUMN unit_id TO course_id;
ALTER TABLE flashcards ALTER COLUMN course_id TYPE uuid USING NULL;
ALTER TABLE flashcards ADD CONSTRAINT flashcards_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE quiz_scores DROP CONSTRAINT IF EXISTS quiz_scores_unit_id_fkey;
ALTER TABLE quiz_scores RENAME COLUMN unit_id TO course_id;
ALTER TABLE quiz_scores ALTER COLUMN course_id TYPE uuid USING NULL;
ALTER TABLE quiz_scores ADD CONSTRAINT quiz_scores_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE saved_links DROP CONSTRAINT IF EXISTS saved_links_unit_id_fkey;
ALTER TABLE saved_links RENAME COLUMN unit_id TO course_id;
ALTER TABLE saved_links ALTER COLUMN course_id TYPE uuid USING NULL;
ALTER TABLE saved_links ADD CONSTRAINT saved_links_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE study_files DROP CONSTRAINT IF EXISTS study_files_unit_id_fkey;
ALTER TABLE study_files RENAME COLUMN unit_id TO course_id;
ALTER TABLE study_files ALTER COLUMN course_id TYPE uuid USING NULL;
ALTER TABLE study_files ADD CONSTRAINT study_files_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE study_goals DROP CONSTRAINT IF EXISTS study_goals_unit_id_fkey;
ALTER TABLE study_goals RENAME COLUMN unit_id TO course_id;
ALTER TABLE study_goals ALTER COLUMN course_id TYPE uuid USING NULL;
ALTER TABLE study_goals ADD CONSTRAINT study_goals_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- Add weekly_goal and color columns to courses table for study tracking
ALTER TABLE courses ADD COLUMN IF NOT EXISTS weekly_goal integer DEFAULT 8;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS color text DEFAULT '#3B82F6';