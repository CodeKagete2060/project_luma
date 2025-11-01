import React from 'react';
import StatsCard from '../components/shared/StatsCard';
import NotificationBell from '../components/shared/NotificationBell';
import ProgressChart from '../components/student/ProgressChart';
import ResourceCard from '../components/shared/ResourceCard';
import AIChatInterface from '../components/student/AIChatInterface';
import { useToast } from '../hooks/use-toast';

function StudentDashboard() {
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: 'Welcome Back',
      description: "Let's continue your learning journey!",
    });
  }, []);

  const resources = [
    {
      title: 'Math Practice',
      description: 'Interactive algebra exercises',
      type: 'exercise',
      progress: 75,
    },
    {
      title: 'Science Lab',
      description: 'Virtual chemistry experiments',
      type: 'interactive',
      progress: 30,
    },
    {
      title: 'Reading Assignment',
      description: 'Literature analysis',
      type: 'assignment',
      progress: 100,
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <NotificationBell />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Course Progress"
          value="78%"
          description="Overall Completion"
          trend="up"
        />
        <StatsCard
          title="Current Grade"
          value="A-"
          description="Average"
          trend="stable"
        />
        <StatsCard
          title="Study Time"
          value="12h"
          description="This Week"
          trend="up"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
          <ProgressChart className="bg-card rounded-lg p-4" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Resources</h2>
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <ResourceCard key={index} {...resource} />
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">AI Learning Assistant</h2>
        <AIChatInterface className="bg-card rounded-lg" />
      </div>
    </div>
  );
}

export default StudentDashboard;