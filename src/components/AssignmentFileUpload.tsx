
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, File } from 'lucide-react';
import { useAssignmentFiles } from '@/hooks/useAssignmentFiles';

interface AssignmentFileUploadProps {
  assignmentId: string;
}

const AssignmentFileUpload = ({ assignmentId }: AssignmentFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { files, uploadFile, deleteFile, isUploading, isDeleting } = useAssignmentFiles(assignmentId);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile({ file, assignmentId });
      // Reset input
      event.target.value = '';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileView = (fileUrl: string, fileName: string) => {
    // Create a temporary link to view/download the file
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleFileSelect}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
      />

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Attached Files:</p>
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-2 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleFileView(file.file_url, file.file_name)}
                    className="h-auto p-0 font-medium text-blue-600 hover:text-blue-800"
                  >
                    {file.file_name}
                  </Button>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.file_size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {file.file_type?.split('/')[1] || 'file'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteFile(file.id)}
                  disabled={isDeleting}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentFileUpload;
