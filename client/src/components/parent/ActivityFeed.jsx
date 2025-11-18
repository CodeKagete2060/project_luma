import React from 'react';
import { cn } from '../../lib/utils';

function ActivityFeed({ activities = [], className }) {
  return (
    <div className={cn('space-y-4', className)}>
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-4 p-4 bg-card rounded-lg">
          <div className="flex-1">
            <p className="text-sm font-medium">{activity.title}</p>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
          </div>
        </div>
      ))}
      {activities.length === 0 && (
        <div className="text-center text-muted-foreground p-4">
          No activities to show
        </div>
      )}
    </div>
  );
}

ActivityFeed.defaultProps = {
  activities: [],
  className: ''
};

export default ActivityFeed;