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

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStart = new Date(tomorrow.setHours(0, 0, 0, 0));
    const tomorrowEnd = new Date(tomorrow.setHours(23, 59, 59, 999));

    // Find assignments due tomorrow that are not completed
    const { data: assignments, error: assignmentsError } = await supabaseClient
      .from('assignments')
      .select(`
        id,
        title,
        due_date,
        user_id,
        courses (name)
      `)
      .eq('completed', false)
      .gte('due_date', tomorrowStart.toISOString())
      .lte('due_date', tomorrowEnd.toISOString());

    if (assignmentsError) throw assignmentsError;

    for (const assignment of assignments) {
      // Check if we've already sent a notification for this assignment today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: existingNotification } = await supabaseClient
        .from('notifications')
        .select('id')
        .eq('user_id', assignment.user_id)
        .eq('related_table', 'assignments')
        .eq('related_id', assignment.id)
        .gte('created_at', today.toISOString())
        .single();

      if (existingNotification) continue; // Already notified today

      // Format the due date
      const dueDate = new Date(assignment.due_date);
      const formattedDate = dueDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const courseName = assignment.courses?.name || 'Unknown Course';
      
      // Create the notification
      const { error: notificationError } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: assignment.user_id,
          title: 'Assignment Due Tomorrow',
          message: `"${assignment.title}" for ${courseName} is due tomorrow (${formattedDate}). Don't forget to complete it!`,
          type: 'warning',
          related_table: 'assignments',
          related_id: assignment.id,
        });

      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Assignment due notifications generated successfully",
        assignmentsProcessed: assignments.length 
      }),
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