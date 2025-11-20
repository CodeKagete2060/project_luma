import { NotificationBell } from "../shared/NotificationBell";

export default function NotificationBellExample() {
  return (
    <div className="p-8 bg-background flex justify-center">
      <div className="flex items-center gap-4 p-4 rounded-md border border-border">
        <span className="text-sm text-muted-foreground">Notification Bell Component:</span>
        <NotificationBell />
      </div>
    </div>
  );
}
