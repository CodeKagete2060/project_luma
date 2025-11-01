import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp } from "lucide-react";

interface DiscussionThreadProps {
  title: string;
  author: string;
  authorAvatar?: string;
  content: string;
  category: string;
  replies: number;
  likes: number;
  timestamp: string;
}

export function DiscussionThread({
  title,
  author,
  authorAvatar,
  content,
  category,
  replies,
  likes,
  timestamp,
}: DiscussionThreadProps) {
  return (
    <Card className="hover-elevate">
      <CardHeader>
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={authorAvatar} alt={author} />
            <AvatarFallback className="bg-primary text-primary-foreground">{author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <Badge variant="secondary">{category}</Badge>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span>{author}</span>
              <span>•</span>
              <span>{timestamp}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground">{content}</p>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" data-testid={`button-like-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <ThumbsUp className="w-4 h-4" />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" data-testid={`button-reply-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <MessageSquare className="w-4 h-4" />
            <span>{replies} replies</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
