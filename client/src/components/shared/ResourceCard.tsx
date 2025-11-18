import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye } from "lucide-react";

interface ResourceCardProps {
  resource: {
    _id: string;
    title: string;
    description: string;
    subject: string;
    type: string;
    difficulty: string;
    thumbnailUrl?: string;
    duration?: number;
    views: number;
    ratings: Array<{ rating: number }>;
    likedBy: string[];
    createdBy: {
      firstName: string;
      lastName: string;
    };
    createdAt?: string;
  };
  onView?: () => void;
  onLike?: () => void;
  onRate?: (rating: number) => void;
}

export default function ResourceCard({ resource, onView, onLike, onRate }: ResourceCardProps) {
  const {
    title,
    description,
    subject,
    type,
    difficulty,
    thumbnailUrl,
    duration,
    views,
    ratings,
    likedBy,
    createdBy
  } = resource;

  // Calculate average rating
  const averageRating = ratings.length > 0
    ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
    : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            <FileText className="w-12 h-12 text-primary flex-shrink-0" />
          )}
          <div className="flex flex-wrap gap-2">
            <Badge>{subject}</Badge>
            <Badge variant="outline">{type}</Badge>
            <Badge variant="secondary" className="capitalize">{difficulty}</Badge>
          </div>
        </div>
        <CardTitle className="text-lg mt-2 line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{description}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{views} views</span>
          </div>
          {duration && (
            <div className="flex items-center gap-1">
              <span>{duration} min</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span>{averageRating.toFixed(1)}</span>
            <span>★</span>
            <span>({ratings.length})</span>
          </div>
          <div>
            <span>{likedBy.length} likes</span>
          </div>
        </div>
        <div className="mt-2 text-sm">
          By {createdBy.firstName} {createdBy.lastName}
        </div>
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
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onLike}
          data-testid={`like-resource-${resource._id}`}
        >
          <span className="mr-2">♥</span>
          Like
        </Button>
      </CardFooter>
    </Card>
  );
}
