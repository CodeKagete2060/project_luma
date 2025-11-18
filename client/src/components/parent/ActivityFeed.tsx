import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, BookOpen, MessageSquare } from "lucide-react";

interface Activity {
  id: string;
  type: "assignment" | "resource" | "discussion";
  title: string;
  timestamp: string;
  status: "completed" | "in-progress" | "new";
}

const activities: Activity[] = [
  { id: "1", type: "assignment", title: "Completed Math homework on Algebra", timestamp: "2 hours ago", status: "completed" },
  { id: "2", type: "resource", title: "Viewed Science video on Photosynthesis", timestamp: "5 hours ago", status: "completed" },
  { id: "3", type: "discussion", title: "Participated in History discussion", timestamp: "1 day ago", status: "completed" },
  { id: "4", type: "assignment", title: "Started English essay assignment", timestamp: "1 day ago", status: "in-progress" },
];

export function ActivityFeed() {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "assignment":
        return CheckCircle;
      case "resource":
        return BookOpen;
      case "discussion":
        return MessageSquare;
    }
  };

  const getStatusColor = (status: Activity["status"]) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "new":
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = getIcon(activity.type);
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-md hover-elevate" data-testid={`activity-${activity.id}`}>
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>
              </div>
              <Badge variant={getStatusColor(activity.status)} className="flex-shrink-0 capitalize">
                {activity.status.replace("-", " ")}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
