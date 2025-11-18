import { StatsCard } from "../shared/StatsCard";
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="p-8 bg-background grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard 
        title="Assignments Completed" 
        value={12} 
        icon={BookOpen}
        trend={{ value: "3 this week", isPositive: true }}
      />
      <StatsCard 
        title="Study Time" 
        value="24h" 
        icon={Clock}
        description="This month"
      />
      <StatsCard 
        title="Average Score" 
        value="85%" 
        icon={Award}
        trend={{ value: "+5% from last week", isPositive: true }}
      />
      <StatsCard 
        title="Learning Streak" 
        value="7 days" 
        icon={TrendingUp}
        description="Keep it up!"
      />
    </div>
  );
}
