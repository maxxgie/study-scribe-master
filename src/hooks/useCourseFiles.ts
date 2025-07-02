
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CourseFile {
  id: string;
  course_id: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  user_id: string;
  created_at: string;
}

export const useCourseFiles = (courseId?: string) => {
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['course-files', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      
      const { data, error } = await supabase
        .from('course_files')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CourseFile[];
    },
    enabled: !!courseId,
  });

  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, courseId }: { file: File; courseId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-files')
        .getPublicUrl(filePath);

      const { data, error } = await supabase
        .from('course_files')
        .insert([{
          course_id: courseId,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
          file_type: file.type,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-files'] });
      toast.success('File uploaded successfully');
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const { data: file } = await supabase
        .from('course_files')
        .select('file_url')
        .eq('id', fileId)
        .single();

      if (file?.file_url) {
        const filePath = file.file_url.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('course-files')
            .remove([`${(await supabase.auth.getUser()).data.user?.id}/${filePath}`]);
        }
      }

      const { error } = await supabase
        .from('course_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-files'] });
      toast.success('File deleted successfully');
    },
    onError: (error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });

  return {
    files,
    isLoading,
    uploadFile: uploadFileMutation.mutate,
    deleteFile: deleteFileMutation.mutate,
    isUploading: uploadFileMutation.isPending,
    isDeleting: deleteFileMutation.isPending,
  };
};
