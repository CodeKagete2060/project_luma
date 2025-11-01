import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", title: "New Assignment", message: "Math homework has been posted", timestamp: "5 min ago", read: false },
  { id: "2", title: "Discussion Reply", message: "Someone replied to your question", timestamp: "1 hour ago", read: false },
  { id: "3", title: "Progress Update", message: "You've completed 5 assignments this week!", timestamp: "2 hours ago", read: true },
];

export function NotificationBell() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h4 className="font-semibold text-foreground">Notifications</h4>
          <Button variant="ghost" size="sm" className="h-7 text-xs" data-testid="button-mark-all-read">
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-80">
          <div className="p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-md mb-2 hover-elevate ${!notification.read ? 'bg-primary/5' : ''}`}
                data-testid={`notification-${notification.id}`}
              >
                <p className="text-sm font-medium text-foreground">{notification.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
