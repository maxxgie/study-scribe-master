import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface CreateNotificationData {
  title: string;
  message: string;
  type: NotificationType;
  related_table?: string;
  related_id?: string;
}

export const createNotification = async (
  userId: string,
  notificationData: CreateNotificationData
) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        ...notificationData,
      });

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to create notification:', error);
    toast.error('Failed to create notification');
    return { success: false, error };
  }
};

export const createTestNotifications = async (userId: string) => {
  const testNotifications = [
    {
      title: 'Welcome to Smart Study Planner!',
      message: 'Start tracking your study sessions and manage your assignments efficiently.',
      type: 'info' as NotificationType,
    },
    {
      title: 'Assignment Due Tomorrow',
      message: 'Your Database Systems assignment is due tomorrow at 11:59 PM. Don\'t forget to submit it!',
      type: 'warning' as NotificationType,
      related_table: 'assignments',
    },
    {
      title: 'Profile Updated Successfully',
      message: 'Your personal details have been successfully updated.',
      type: 'success' as NotificationType,
      related_table: 'profiles',
    },
    {
      title: 'Weekly Progress Report',
      message: 'This week you studied for 12.5 hours across 8 sessions covering 3 courses. Your weekly goal: 15h (83% complete)',
      type: 'info' as NotificationType,
      related_table: 'study_sessions',
    },
  ];

  for (const notification of testNotifications) {
    await createNotification(userId, notification);
  }
};