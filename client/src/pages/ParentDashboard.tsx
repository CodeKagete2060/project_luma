import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { StatsCard } from "@/components/shared/StatsCard";
import { ActivityFeed } from "@/components/parent/ActivityFeed";
import { ProgressChart } from "@/components/parent/ProgressChart";
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react";

export default function ParentDashboard() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="parent" userName="Jane Smith" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b border-border bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-2xl font-bold text-foreground font-display">Parent Dashboard</h1>
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
              className="max-w-7xl mx-auto space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2 font-display">Alex's Progress</h2>
                <p className="text-muted-foreground">Monitor your child's learning journey</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Assignments This Week"
                  value={5}
                  icon={BookOpen}
                  trend={{ value: "2 completed", isPositive: true }}
                />
                <StatsCard title="Total Study Time" value="18h" icon={Clock} description="This week" />
                <StatsCard
                  title="Average Performance"
                  value="87%"
                  icon={Award}
                  trend={{ value: "+3% this month", isPositive: true }}
                />
                <StatsCard
                  title="Active Streak"
                  value="12 days"
                  icon={TrendingUp}
                  description="Great consistency!"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProgressChart />
                <ActivityFeed />
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
