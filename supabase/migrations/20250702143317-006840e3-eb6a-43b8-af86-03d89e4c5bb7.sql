-- Update the handle_new_user function to create a welcome notification
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
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
  
  -- Create welcome notification
  INSERT INTO public.notifications (user_id, title, message, type) VALUES
    (new.id, 'Welcome to Smart Study Planner!', 'Start tracking your study sessions, manage assignments, and achieve your academic goals efficiently. Your dashboard is ready to help you succeed!', 'info');
  
  RETURN new;
END;
$$;