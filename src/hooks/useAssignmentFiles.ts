
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AssignmentFile {
  id: string;
  assignment_id: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  user_id: string;
  created_at: string;
}

export const useAssignmentFiles = (assignmentId?: string) => {
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['assignment-files', assignmentId],
    queryFn: async () => {
      if (!assignmentId) return [];
      
      const { data, error } = await supabase
        .from('assignment_files')
        .select('*')
        .eq('assignment_id', assignmentId);
      
      if (error) throw error;
      return data as AssignmentFile[];
    },
    enabled: !!assignmentId,
  });

  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, assignmentId }: { file: File; assignmentId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${assignmentId}/${Date.now()}.${fileExt}`;
      
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assignment-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('assignment-files')
        .getPublicUrl(fileName);

      // Save file metadata to database
      const { data, error } = await supabase
        .from('assignment_files')
        .insert({
          assignment_id: assignmentId,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
          file_type: file.type,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-files'] });
      toast.success('File uploaded successfully');
    },
    onError: (error) => {
      console.error('File upload error:', error);
      toast.error('Failed to upload file');
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      // Get file info first
      const { data: fileData, error: fetchError } = await supabase
        .from('assignment_files')
        .select('file_url')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      // Extract file path from URL
      const url = new URL(fileData.file_url);
      const filePath = url.pathname.split('/').slice(-3).join('/'); // user_id/assignment_id/filename

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('assignment-files')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('assignment_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-files'] });
      toast.success('File deleted successfully');
    },
    onError: (error) => {
      console.error('File delete error:', error);
      toast.error('Failed to delete file');
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
