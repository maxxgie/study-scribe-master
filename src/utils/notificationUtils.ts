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
      title: 'Study Goal Reminder',
      message: 'You are behind on your weekly study goal. Consider scheduling more study time.',
      type: 'warning' as NotificationType,
    },
    {
      title: 'Assignment Completed',
      message: 'Great job! You have successfully completed your Database Systems assignment.',
      type: 'success' as NotificationType,
    },
  ];

  for (const notification of testNotifications) {
    await createNotification(userId, notification);
  }
};