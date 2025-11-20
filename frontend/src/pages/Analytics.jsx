import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/use-analytics';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';
import { ActivityChart } from '@/components/analytics/ActivityChart';
import { ProgressBreakdown } from '@/components/analytics/ProgressBreakdown';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  BookOpen,
  Brain,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';

function StatCard({ title, value, icon: Icon, trend, isLoading }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-[100px]" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {trend && (
              <p className="text-xs text-muted-foreground">
                {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const {
    performance,
    activity,
    subjectBreakdown,
    streak,
    aiStats,
    recentAssignments,
    isLoading
  } = useAnalytics(user?._id);

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
              <h1 className="text-2xl font-bold font-display">Analytics Dashboard</h1>
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
              className="space-y-6"
            >
              {/* Overview Stats */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Current Streak"
                  value={`${streak?.days || 0} days`}
                  icon={TrendingUp}
                  trend={streak?.trend}
                  isLoading={isLoading}
                />
                <StatCard
                  title="Study Time"
                  value={`${activity?.totalHours || 0}h`}
                  icon={Clock}
                  trend={activity?.trend}
                  isLoading={isLoading}
                />
                <StatCard
                  title="Assignments Completed"
                  value={recentAssignments?.completed || 0}
                  icon={BookOpen}
                  trend={recentAssignments?.trend}
                  isLoading={isLoading}
                />
                <StatCard
                  title="Average Score"
                  value={`${performance?.average || 0}%`}
                  icon={Target}
                  trend={performance?.trend}
                  isLoading={isLoading}
                />
              </div>

              {/* Charts */}
              <div className="grid gap-4 md:grid-cols-2">
                <PerformanceChart
                  title="Performance Trend"
                  description="Your academic performance over time"
                  data={performance?.trend || []}
                />
                <ActivityChart
                  title="Activity Overview"
                  description="Your learning activities breakdown"
                  data={activity?.breakdown || []}
                />
              </div>

              {/* Subject Progress */}
              <div className="grid gap-4 md:grid-cols-2">
                <ProgressBreakdown
                  title="Subject Progress"
                  description="Your progress in different subjects"
                  data={subjectBreakdown?.subjects || []}
                />

                <Card>
                  <CardHeader>
                    <CardTitle>AI Learning Assistant Usage</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Your interaction with AI features
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[72px] w-full" />
                      ))
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              AI-Assisted Solutions
                            </p>
                            <div className="flex items-center gap-2">
                              <Brain className="h-4 w-4 text-muted-foreground" />
                              <span className="text-2xl font-bold">
                                {aiStats?.totalSessions || 0}
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {aiStats?.usageChange || '0%'} vs last week
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Most Assisted Subject</span>
                            <span className="font-medium">
                              {aiStats?.topSubject || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Average Help Rating</span>
                            <span className="font-medium">
                              {aiStats?.averageRating || 'N/A'}/5
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Improvement Rate</span>
                            <span className="font-medium">
                              {aiStats?.improvementRate || '0%'}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[72px] w-full" />
                      ))
                    ) : (performance?.achievements || []).map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-card"
                      >
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                        <Badge>
                          {achievement.date}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}