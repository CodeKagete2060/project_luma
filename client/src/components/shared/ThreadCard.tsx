import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MessageSquare, AlertTriangle, Lock, Pin, ThumbsUp } from "lucide-react";

interface ThreadCardProps {
  thread: {
    _id: string;
    title: string;
    content: string;
    author: {
      firstName: string;
      lastName: string;
      role: string;
    };
    category: string;
    tags: string[];
    isAnnouncement: boolean;
    isPinned: boolean;
    isLocked: boolean;
    views: number;
    likes: string[];
    replies: any[];
    createdAt: string;
    lastActivityAt: string;
  };
  onView?: () => void;
  currentUserId?: string;
  onLike?: () => void;
  onReport?: () => void;
}

export default function ThreadCard({ 
  thread, 
  onView,
  currentUserId,
  onLike,
  onReport
}: ThreadCardProps) {
  const {
    title,
    content,
    author,
    category,
    tags,
    isAnnouncement,
    isPinned,
    isLocked,
    views,
    likes,
    replies,
    lastActivityAt
  } = thread;

  const isLiked = currentUserId && likes.includes(currentUserId);
  const lastActivity = new Date(lastActivityAt).toLocaleString();

  return (
    <Card className={cn(
      "hover:shadow-md transition-shadow duration-200",
      isAnnouncement && "border-l-4 border-warning",
      isPinned && "border-t-4 border-primary"
    )}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={isAnnouncement ? "warning" : "default"}>{category}</Badge>
              {tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
              {isPinned && (
                <Badge variant="outline">
                  <Pin className="w-3 h-3 mr-1" />
                  Pinned
                </Badge>
              )}
              {isLocked && (
                <Badge variant="destructive">
                  <Lock className="w-3 h-3 mr-1" />
                  Locked
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground line-clamp-2 mb-4">{content}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>By {author.firstName} {author.lastName}</span>
              <Badge variant="outline">{author.role}</Badge>
              <span>Last activity: {lastActivity}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              disabled={isLocked}
              onClick={onView}
            >
              <Eye className="w-4 h-4 mr-1" />
              {views}
            </Button>
            <Button 
              variant={isLiked ? "default" : "ghost"}
              size="sm"
              disabled={isLocked || !currentUserId}
              onClick={onLike}
            >
              <Heart className={cn(
                "w-4 h-4 mr-1",
                isLiked && "fill-current"
              )} />
              {likes.length}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isLocked}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              {replies.length}
            </Button>
          </div>
          
          {currentUserId && currentUserId !== author._id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReport}
            >
              <AlertTriangle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}