import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useParams } from 'wouter';
import { useSocket } from '@/hooks/use-socket';
import { useAuth } from '@/contexts/AuthContext';
import VideoTutoring from '@/components/tutoring/VideoTutoring';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { NotificationBell } from '@/components/shared/NotificationBell';

function TutoringSession() {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!sessionId || !socket.connected) return;

    // Listen for session events
    const handleSessionEnd = () => {
      toast({
        title: 'Session Ended',
        description: 'The tutoring session has ended'
      });
      navigate('/dashboard');
    };

    socket.on('session_ended', handleSessionEnd);

    return () => {
      socket.off('session_ended', handleSessionEnd);
    };
  }, [sessionId, socket.connected]);

  const handleEndSession = () => {
    socket.emit('end_session', { sessionId });
    navigate('/dashboard');
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
              <div>
                <h1 className="text-2xl font-bold font-display">
                  Tutoring Session
                </h1>
                <p className="text-sm text-muted-foreground">
                  Session ID: {sessionId}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                onClick={handleEndSession}
              >
                End Session
              </Button>
              <NotificationBell />
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-hidden p-6 bg-background">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VideoTutoring
                roomId={sessionId}
                isHost={user?.role === 'tutor'}
              />
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default TutoringSession;