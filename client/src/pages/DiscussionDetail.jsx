import React, { useState } from 'react';
import { useParams } from 'wouter';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useDiscussion } from '@/hooks/use-discussions';
import { ForumPost } from '@/components/forum/ForumPost';
import { ForumReply } from '@/components/forum/ForumReply';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { useToast } from '@/hooks/use-toast';

export default function DiscussionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    discussion,
    isLoading,
    addReply,
    upvoteDiscussion,
    upvoteReply,
    flagDiscussion,
    flagReply,
    markAsAnswer
  } = useDiscussion(id);

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await addReply.mutateAsync({
        discussionId: id,
        content: replyContent
      });
      setReplyContent('');
      toast({
        description: 'Reply added successfully!'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add reply. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvoteDiscussion = async () => {
    try {
      await upvoteDiscussion.mutateAsync(id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upvote. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleUpvoteReply = async (replyId) => {
    try {
      await upvoteReply.mutateAsync({ discussionId: id, replyId });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upvote. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleFlagDiscussion = async () => {
    try {
      await flagDiscussion.mutateAsync(id);
      toast({
        description: 'Discussion has been flagged for review.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to flag discussion. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleFlagReply = async (replyId) => {
    try {
      await flagReply.mutateAsync({ discussionId: id, replyId });
      toast({
        description: 'Reply has been flagged for review.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to flag reply. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleMarkAsAnswer = async (replyId) => {
    try {
      await markAsAnswer.mutateAsync({ discussionId: id, replyId });
      toast({
        description: 'Answer marked as accepted!'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark answer. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const style = {
    '--sidebar-width': '16rem',
    '--sidebar-width-icon': '3rem',
  };

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full">
        <AppSidebar 
          role={user?.role} 
          userName={`${user?.firstName} ${user?.lastName}`}
        />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold font-display">Discussion</h1>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-background">
            {isLoading ? (
              <div className="text-center py-8">Loading discussion...</div>
            ) : !discussion ? (
              <div className="text-center py-8">Discussion not found</div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <ForumPost
                  post={discussion}
                  onUpvote={handleUpvoteDiscussion}
                  onFlag={handleFlagDiscussion}
                  isAuthor={discussion.author._id === user?._id}
                  isModerated={user?.role === 'admin' || user?.role === 'moderator'}
                />

                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">
                    {discussion.replies.length} Replies
                  </h2>

                  <form onSubmit={handleAddReply} className="space-y-4">
                    <Textarea
                      placeholder="Add your reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={4}
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting || !replyContent.trim()}
                    >
                      {isSubmitting ? 'Posting...' : 'Post Reply'}
                    </Button>
                  </form>

                  <div className="space-y-4 mt-8">
                    {discussion.replies.map((reply) => (
                      <ForumReply
                        key={reply._id}
                        reply={reply}
                        onUpvote={() => handleUpvoteReply(reply._id)}
                        onFlag={() => handleFlagReply(reply._id)}
                        onMarkAsAnswer={() => handleMarkAsAnswer(reply._id)}
                        isAuthor={reply.author._id === user?._id}
                        isModerated={user?.role === 'admin' || user?.role === 'moderator'}
                        canMarkAnswer={
                          discussion.author._id === user?._id &&
                          !discussion.selectedAnswer
                        }
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}