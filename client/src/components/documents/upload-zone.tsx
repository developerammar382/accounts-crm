import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CloudUpload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadZoneProps {
  businessId: string;
}

interface UploadFile {
  file: File;
  id: string;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  error?: string;
}

export default function UploadZone({ businessId }: UploadZoneProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('businessId', businessId);
      formData.append('fileName', file.name);
      formData.append('fileType', file.type);
      formData.append('fileSize', file.size.toString());
      
      const response = await apiRequest('POST', '/api/documents', {
        businessId,
        fileName: file.name,
        fileType: file.type.split('/')[1],
        fileSize: file.size
      });
      return response.json();
    },
    onSuccess: (data, file) => {
      setUploadFiles(prev => prev.map(f => 
        f.file === file 
          ? { ...f, status: 'processing', progress: 100 }
          : f
      ));
      
      // Simulate processing delay
      setTimeout(() => {
        setUploadFiles(prev => prev.map(f => 
          f.file === file 
            ? { ...f, status: 'complete' }
            : f
        ));
        
        queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
        
        toast({
          title: "Document uploaded successfully",
          description: "OCR processing has started automatically",
        });
      }, 2000);
    },
    onError: (error, file) => {
      setUploadFiles(prev => prev.map(f => 
        f.file === file 
          ? { ...f, status: 'error', error: error.message }
          : f
      ));
      
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading' as const,
      progress: 0
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);

    // Start uploads
    newFiles.forEach(({ file }) => {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadFiles(prev => prev.map(f => 
          f.file === file && f.progress < 90
            ? { ...f, progress: f.progress + 10 }
            : f
        ));
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        uploadMutation.mutate(file);
      }, 2000);
    });
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <CloudUpload className="h-4 w-4 animate-pulse text-primary" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusText = (file: UploadFile) => {
    switch (file.status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing with OCR...';
      case 'complete':
        return 'Complete';
      case 'error':
        return file.error || 'Upload failed';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <Card>
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CloudUpload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop files here' : 'Upload Documents'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports PDF, JPG, PNG files up to 50MB
            </p>
            <Button variant="outline">
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Upload Progress</h3>
            <div className="space-y-4">
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="flex items-center space-x-4">
                  {getStatusIcon(uploadFile.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{uploadFile.file.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {getStatusText(uploadFile)}
                      </span>
                    </div>
                    {uploadFile.status !== 'complete' && uploadFile.status !== 'error' && (
                      <Progress value={uploadFile.progress} className="h-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
