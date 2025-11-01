import React from 'react';
import ActivityFeed from '../components/parent/ActivityFeed';
import ProgressChart from '../components/parent/ProgressChart';
import NotificationBell from '../components/shared/NotificationBell';
import StatsCard from '../components/shared/StatsCard';
import { useToast } from '../hooks/use-toast';

function ParentDashboard() {
  const { toast } = useToast();

  React.useEffect(() => {
    // Simulate loading data
    toast({
      title: 'Welcome Back',
      description: "You're viewing your child's latest progress",
    });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parent Dashboard</h1>
        <NotificationBell />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Assignments"
          value="85%"
          description="Complete"
          trend="up"
        />
        <StatsCard
          title="Attendance"
          value="95%"
          description="Present"
          trend="up"
        />
        <StatsCard
          title="Grade Average"
          value="A-"
          description="Current Term"
          trend="stable"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
          <ProgressChart className="bg-card rounded-lg p-4" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ActivityFeed className="bg-card rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;