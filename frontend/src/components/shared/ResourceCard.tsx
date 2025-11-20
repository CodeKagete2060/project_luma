import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye } from "lucide-react";

interface ResourceCardProps {
  resource: {
    _id: string;
    title: string;
    summary?: string;
    subject: string;
    tags?: string[];
    fileUrl?: string;
    filename?: string;
    uploadedBy?: {
      username?: string;
      email?: string;
    };
    size?: number;
    createdAt?: string;
  };
  onView?: () => void;
  onDownload?: () => void;
}

export default function ResourceCard({ resource, onView, onDownload }: ResourceCardProps) {
  const {
    title,
    summary,
    subject,
    tags,
    fileUrl,
    filename,
    uploadedBy,
    size
  } = resource;

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <FileText className="w-12 h-12 text-primary flex-shrink-0" />
          <div className="flex flex-wrap gap-2">
            <Badge>{subject}</Badge>
            {tags && tags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>
        <CardTitle className="text-lg mt-2 line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {summary && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{summary}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {size && (
            <div className="flex items-center gap-1">
              <span>{formatFileSize(size)}</span>
            </div>
          )}
          {filename && (
            <div className="flex items-center gap-1">
              <span>{filename.split('.').pop()?.toUpperCase()}</span>
            </div>
          )}
        </div>
        {uploadedBy && (
          <div className="mt-2 text-sm">
            Uploaded by: {uploadedBy.username || uploadedBy.email || 'Unknown'}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={onView}
          data-testid={`view-resource-${resource._id}`}
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        {fileUrl && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              if (onDownload) {
                onDownload();
              } else {
                window.open(fileUrl, '_blank');
              }
            }}
            data-testid={`download-resource-${resource._id}`}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
