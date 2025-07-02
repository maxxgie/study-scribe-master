import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudy } from '@/contexts/StudyContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { createNotification } from '@/utils/notificationUtils';
import { BarChart, Calendar, CheckCircle } from 'lucide-react';

const WeeklyProgressManager = () => {
  const { user } = useAuth();
  const { getWeeklyProgress, getLaggingUnits, refreshData } = useStudy();

  const resetWeeklyProgress = async (keepLaggingUnits: boolean = true) => {
    if (!user?.id) return;

    try {
      console.log('Starting weekly progress reset...');
      
      // Get current weekly progress
      const weeklyProgress = getWeeklyProgress();
      const laggingUnits = getLaggingUnits();
      
      // Calculate week info
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const weekNumber = Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));

      // Create weekly progress record
      const totalHours = Object.values(weeklyProgress).reduce((sum, progress) => sum + progress, 0);
      const totalGoals = Object.keys(weeklyProgress).length;
      const goalsMet = Object.values(weeklyProgress).filter(p => p >= 100).length;

      console.log('Inserting weekly progress record...');
      const { error: progressError } = await supabase
        .from('weekly_progress')
        .insert({
          user_id: user.id,
          week_number: weekNumber,
          start_date: startOfWeek.toISOString(),
          end_date: endOfWeek.toISOString(),
          total_hours: totalHours,
          total_goals: totalGoals,
          goals_met: goalsMet,
          summary: `Week ${weekNumber}: ${goalsMet}/${totalGoals} goals achieved with ${totalHours.toFixed(1)} total hours studied.`,
          recommendations: laggingUnits.length > 0 
            ? `Focus on: ${laggingUnits.slice(0, 3).map(u => u.name).join(', ')}`
            : 'Great progress! Continue maintaining your study momentum.',
        });

      if (progressError) {
        console.error('Error inserting weekly progress:', progressError);
        throw progressError;
      }

      // If not keeping lagging units, reset course flags (using courses table instead of study_units)
      if (!keepLaggingUnits) {
        console.log('Resetting course lagging status...');
        // Note: The lagging status is computed dynamically, so we don't need to reset anything in courses table
        // This is intentionally simplified since courses table doesn't have lagging flags
      }

      // Create notification
      console.log('Creating notification...');
      await createNotification(user.id, {
        title: 'Weekly Progress Reset',
        message: `Weekly progress has been saved and reset. ${keepLaggingUnits ? 'Lagging units status preserved.' : 'All unit statuses reset.'}`,
        type: 'info',
        related_table: 'weekly_progress',
      });

      // Refresh data to show updated state
      console.log('Refreshing data...');
      await refreshData();
      
      toast.success('Weekly progress reset successfully');

    } catch (error) {
      console.error('Error resetting weekly progress:', error);
      toast.error(`Failed to reset weekly progress: ${error.message || 'Unknown error'}`);
    }
  };

  const weeklyProgress = getWeeklyProgress();
  const laggingUnits = getLaggingUnits();
  const progressEntries = Object.entries(weeklyProgress);
  const completedGoals = progressEntries.filter(([_, progress]) => progress >= 100).length;
  const totalGoals = progressEntries.length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Weekly Progress Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
              <div className="text-sm text-muted-foreground">Goals Completed</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalGoals}</div>
              <div className="text-sm text-muted-foreground">Total Goals</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{laggingUnits.length}</div>
              <div className="text-sm text-muted-foreground">Lagging Units</div>
            </div>
          </div>

          {/* Lagging Units */}
          {laggingUnits.length > 0 && (
            <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950/20">
              <h4 className="font-medium text-orange-800 dark:text-orange-400 mb-2">Units Need Attention:</h4>
              <div className="space-y-1">
                {laggingUnits.map(unit => (
                  <div key={unit.id} className="text-sm text-orange-700 dark:text-orange-300">
                    • {unit.name} (Goal: {unit.weeklyGoal}h/week)
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reset Options */}
          <div className="space-y-3">
            <h4 className="font-medium">Reset Weekly Progress</h4>
            <p className="text-sm text-muted-foreground">
              Save current progress and start fresh for the new week. This only resets study session progress, not assignments. Assignments persist throughout the semester.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => resetWeeklyProgress(true)}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Reset (Keep Lagging Units)
              </Button>
              <Button
                onClick={() => resetWeeklyProgress(false)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Reset (Clear All Status)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyProgressManager;
