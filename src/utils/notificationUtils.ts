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

// Utility function for creating welcome notification for new users
export const createWelcomeNotification = async (userId: string) => {
  return await createNotification(userId, {
    title: 'Welcome to Smart Study Planner!',
    message: 'Start tracking your study sessions, manage assignments, and achieve your academic goals efficiently.',
    type: 'info',
  });
};