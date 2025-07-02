import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the current week's start and end dates
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Get all users
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id');

    if (profilesError) throw profilesError;

    for (const profile of profiles) {
      // Check if we've already sent a weekly report for this week
      const { data: existingNotification } = await supabaseClient
        .from('notifications')
        .select('id')
        .eq('user_id', profile.id)
        .eq('type', 'info')
        .ilike('title', '%Weekly Progress Report%')
        .gte('created_at', startOfWeek.toISOString())
        .lte('created_at', endOfWeek.toISOString())
        .single();

      if (existingNotification) continue; // Already sent this week

      // Get study sessions for this week
      const { data: sessions, error: sessionsError } = await supabaseClient
        .from('study_sessions')
        .select(`
          id,
          duration,
          course_id,
          courses (name)
        `)
        .eq('user_id', profile.id)
        .gte('date', startOfWeek.toISOString())
        .lte('date', endOfWeek.toISOString());

      if (sessionsError) throw sessionsError;

      // Calculate weekly stats
      const totalHours = sessions.reduce((sum, session) => sum + (session.duration / 60), 0);
      const coursesStudied = new Set(sessions.map(s => s.course_id)).size;
      const totalSessions = sessions.length;

      // Get user's goals to compare against
      const { data: goals, error: goalsError } = await supabaseClient
        .from('study_goals')
        .select('target_hours')
        .eq('user_id', profile.id)
        .eq('goal_type', 'weekly')
        .gte('start_date', startOfWeek.toISOString())
        .lte('end_date', endOfWeek.toISOString());

      if (goalsError) throw goalsError;

      const weeklyGoal = goals.reduce((sum, goal) => sum + Number(goal.target_hours), 0);
      const progressPercentage = weeklyGoal > 0 ? Math.round((totalHours / weeklyGoal) * 100) : 0;

      // Create progress message
      let message = `This week you studied for ${totalHours.toFixed(1)} hours across ${totalSessions} sessions`;
      if (coursesStudied > 0) {
        message += ` covering ${coursesStudied} course${coursesStudied > 1 ? 's' : ''}`;
      }
      message += '.';

      if (weeklyGoal > 0) {
        message += ` Your weekly goal: ${weeklyGoal}h (${progressPercentage}% complete)`;
      }

      // Determine notification type based on progress
      let notificationType = 'info';
      if (weeklyGoal > 0) {
        if (progressPercentage >= 100) notificationType = 'success';
        else if (progressPercentage < 50) notificationType = 'warning';
      }

      // Create the notification
      const { error: notificationError } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: profile.id,
          title: 'Weekly Progress Report',
          message,
          type: notificationType,
          related_table: 'study_sessions',
        });

      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }

    return new Response(
      JSON.stringify({ message: "Weekly progress notifications generated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});