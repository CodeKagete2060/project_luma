import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/hooks/use-socket';
import { useSocketStore } from '@/lib/socketManager';
import { useQueries } from '@/hooks/use-queries';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

export default function NotificationBell() {
  const { notifications, markAsRead, markAllAsRead } = useQueries().useNotifications();
  const socket = useSocket();
  const realtimeNotifications = useSocketStore((state) => state.notifications);

  // Combine API notifications with realtime notifications
  const allNotifications = [...realtimeNotifications, ...(notifications?.data || [])];

  // Subscribe to notification events
  useEffect(() => {
    if (!socket.connected) return;

    const unsubscribe = socket.subscribe('notification', (notification) => {
      // The notification will be automatically added to the store
      // Play notification sound
      new Audio('/notification.mp3').play().catch(() => {});
    });

    return () => unsubscribe();
  }, [socket.connected]);

  const unreadCount = allNotifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="notification-bell"
        >
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center"
              >
                <span className="text-[10px] font-medium text-primary-foreground">
                  {unreadCount}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[400px] overflow-y-auto">
          {allNotifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            allNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-1 p-4 ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="text-sm font-medium">{notification.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}