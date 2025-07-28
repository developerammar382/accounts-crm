import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface DocumentUploadProps {
  businessId: string;
  onUploadComplete?: (document: any) => void;
}

export function DocumentUpload({ businessId, onUploadComplete }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (const file of acceptedFiles) {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 200);

        const documentData = {
          businessId,
          filename: file.name,
          originalName: file.name,
          fileType: file.type,
          fileSize: file.size,
          documentType: getDocumentType(file.name),
        };

        const response = await api.documents.create(documentData);
        const document = await response.json();

        clearInterval(progressInterval);
        setUploadProgress(100);

        toast({
          title: "Document uploaded",
          description: `${file.name} has been uploaded and is being processed.`,
        });

        onUploadComplete?.(document);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your documents. Please try again.",
      });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [businessId, onUploadComplete, toast]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, rejectedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true,
  });

  const getDocumentType = (filename: string): "invoice" | "receipt" | "bank_statement" | "contract" | "other" => {
    const name = filename.toLowerCase();
    if (name.includes("invoice") || name.includes("inv-")) return "invoice";
    if (name.includes("receipt") || name.includes("rec-")) return "receipt";
    if (name.includes("statement") || name.includes("bank")) return "bank_statement";
    if (name.includes("contract") || name.includes("agreement")) return "contract";
    return "other";
  };

  return (
    <Card>
      <CardContent className="p-8">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/25 hover:border-primary/50"
            }
          `}
        >
          <input {...getInputProps()} />
          
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CloudUpload className="h-8 w-8 text-primary" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">
            {isDragActive ? "Drop files here" : "Upload Documents"}
          </h3>
          
          <p className="text-muted-foreground mb-4">
            Drag and drop files here, or click to browse
          </p>
          
          <p className="text-sm text-muted-foreground mb-4">
            Supports PDF, JPG, PNG files up to 50MB
          </p>
          
          <Button variant="outline" disabled={uploading}>
            Choose Files
          </Button>
        </div>

        {uploading && (
          <div className="mt-6">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Uploading documents...</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {acceptedFiles.length > 0 && !uploading && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Uploaded files:</h4>
            <div className="space-y-2">
              {acceptedFiles.map((file) => (
                <div key={file.name} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {rejectedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-destructive mb-2">Rejected files:</h4>
            <div className="space-y-2">
              {rejectedFiles.map((fileRejection) => (
                <div key={fileRejection.file.name} className="flex items-center justify-between p-2 bg-destructive/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <X className="h-4 w-4 text-destructive" />
                    <span className="text-sm">{fileRejection.file.name}</span>
                  </div>
                  <span className="text-xs text-destructive">
                    {fileRejection.errors[0]?.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
