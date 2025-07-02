-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule assignment due date notifications to run daily at 9:00 AM
SELECT cron.schedule(
  'assignment-due-notifications',
  '0 9 * * *', -- Daily at 9:00 AM
  $$
  SELECT
    net.http_post(
        url:='https://ffa4abea-7c3c-4b26-b1c3-80bedc2b19b6.supabase.co/functions/v1/assignment-due-notifications',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcGRjZHF6a2phbWh3YXhheGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODcyNzYsImV4cCI6MjA2Njk2MzI3Nn0.uPfUmXCnWMohTrsIijVhUEnskEFiqZQQKBH7f2F2EuY"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Schedule weekly progress notifications to run every Sunday at 8:00 PM
SELECT cron.schedule(
  'weekly-progress-notifications',
  '0 20 * * 0', -- Every Sunday at 8:00 PM
  $$
  SELECT
    net.http_post(
        url:='https://ffa4abea-7c3c-4b26-b1c3-80bedc2b19b6.supabase.co/functions/v1/weekly-progress-notifications',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcGRjZHF6a2phbWh3YXhheGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODcyNzYsImV4cCI6MjA2Njk2MzI3Nn0.uPfUmXCnWMohTrsIijVhUEnskEFiqZQQKBH7f2F2EuY"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);