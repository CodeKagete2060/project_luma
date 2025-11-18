import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, Flag, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export function ForumReply({
  reply,
  onUpvote,
  onFlag,
  onMarkAsAnswer,
  isAuthor,
  isModerated,
  canMarkAnswer,
  className = ''
}) {
  const {
    content,
    author,
    createdAt,
    upvotes = [],
    isAnswer,
    isAIAssisted,
    attachments = []
  } = reply;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`ml-8 ${className}`}
    >
      <Card className={isAnswer ? 'border-primary' : ''}>
        <CardHeader className="flex-row items-start gap-4 space-y-0">
          <Avatar>
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{author.name}</span>
              <span className="text-xs text-muted-foreground">
                • {format(new Date(createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            {author.role && (
              <Badge variant="outline" className="text-xs">
                {author.role}
              </Badge>
            )}
          </div>
          {isAnswer && (
            <Badge variant="default" className="bg-primary">
              <CheckCircle className="h-3 w-3 mr-1" />
              Best Answer
            </Badge>
          )}
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">
            {content}
          </p>

          {attachments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Attachments:</p>
              <div className="flex flex-wrap gap-2">
                {attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {attachment.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {isAIAssisted && (
            <Badge variant="secondary" className="mt-2">
              AI Assisted
            </Badge>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => onUpvote(reply._id)}
            >
              <ThumbsUp className={`h-4 w-4 ${upvotes.length > 0 ? 'fill-primary' : ''}`} />
              <span>{upvotes.length}</span>
            </Button>

            {canMarkAnswer && !isAnswer && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkAsAnswer(reply._id)}
              >
                Mark as Answer
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isAuthor && !isModerated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFlag(reply._id)}
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