import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, Flag } from 'lucide-react';
import { format } from 'date-fns';

export function ForumPost({
  post,
  onReply,
  onUpvote,
  onFlag,
  isAuthor,
  isModerated,
  className = ''
}) {
  const {
    title,
    content,
    author,
    category,
    tags = [],
    createdAt,
    upvotes = [],
    replyCount = 0,
    isAIAssisted,
    status
  } = post;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={className}
    >
      <Card className={status === 'flagged' ? 'border-destructive' : ''}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>
                  Posted by {author.name} • {format(new Date(createdAt), 'MMM d, yyyy')}
                </CardDescription>
              </div>
            </div>
            <Badge variant={status === 'flagged' ? 'destructive' : 'secondary'}>
              {category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">
            {content}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
            {isAIAssisted && (
              <Badge variant="secondary">AI Assisted</Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => onUpvote(post._id)}
            >
              <ThumbsUp className={`h-4 w-4 ${upvotes.length > 0 ? 'fill-primary' : ''}`} />
              <span>{upvotes.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => onReply(post._id)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{replyCount}</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {!isAuthor && !isModerated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFlag(post._id)}
                className="text-destructive"
              >
                <Flag className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}