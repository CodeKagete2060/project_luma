import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useDiscussions } from '@/hooks/use-discussions';
import { ForumList } from '@/components/forum/ForumList';
import { NewDiscussionForm } from '@/components/forum/NewDiscussionForm';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = [
  'General',
  'Mathematics',
  'Science',
  'History',
  'Literature',
  'Languages',
  'Arts',
  'Technology',
  'Other'
];

export default function ForumPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);

  const {
    discussions,
    isLoading,
    createDiscussion,
    upvoteDiscussion,
    flagDiscussion
  } = useDiscussions();

  const handleCreateDiscussion = async (data) => {
    try {
      await createDiscussion.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Discussion created successfully!'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create discussion. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleUpvote = async (discussionId) => {
    try {
      await upvoteDiscussion.mutateAsync(discussionId);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upvote. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleFlag = async (discussionId) => {
    try {
      await flagDiscussion.mutateAsync(discussionId);
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
              <h1 className="text-2xl font-bold font-display">Discussion Forum</h1>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-background">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ForumList
                posts={discussions?.data || []}
                categories={CATEGORIES}
                onNewPost={() => setIsNewDiscussionOpen(true)}
                onUpvote={handleUpvote}
                onFlag={handleFlag}
                isLoading={isLoading}
              />
            </motion.div>
          </main>
        </div>
      </div>

      <NewDiscussionForm
        isOpen={isNewDiscussionOpen}
        onClose={() => setIsNewDiscussionOpen(false)}
        onSubmit={handleCreateDiscussion}
        categories={CATEGORIES}
        isSubmitting={createDiscussion.isLoading}
      />
    </SidebarProvider>
  );
}