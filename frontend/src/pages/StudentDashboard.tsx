import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { StatsCard } from "@/components/shared/StatsCard";
import { ResourceCard } from "@/components/shared/ResourceCard";
import { DiscussionThread } from "@/components/shared/DiscussionThread";
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="student" userName="Alex Johnson" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b border-border bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-2xl font-bold text-foreground font-display">Dashboard</h1>
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
                <h2 className="text-3xl font-bold text-foreground mb-2 font-display">Welcome back, Alex! 👋</h2>
                <p className="text-muted-foreground">Here's your learning progress overview</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Assignments Completed"
                  value={12}
                  icon={BookOpen}
                  trend={{ value: "3 this week", isPositive: true }}
                />
                <StatsCard title="Study Time" value="24h" icon={Clock} description="This month" />
                <StatsCard
                  title="Average Score"
                  value="85%"
                  icon={Award}
                  trend={{ value: "+5% from last week", isPositive: true }}
                />
                <StatsCard title="Learning Streak" value="7 days" icon={TrendingUp} description="Keep it up!" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-foreground font-display">Study Resources</h3>
                  <Button variant="outline" data-testid="button-view-all-resources">
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ResourceCard
                    title="Introduction to Algebra"
                    category="Mathematics"
                    description="A comprehensive guide covering basic algebraic concepts"
                    uploadedBy="Mr. Smith"
                    uploadDate="Jan 15, 2024"
                    fileType="PDF"
                  />
                  <ResourceCard
                    title="World History Timeline"
                    category="History"
                    description="Interactive timeline covering major historical events"
                    uploadedBy="Ms. Johnson"
                    uploadDate="Jan 18, 2024"
                    fileType="PDF"
                  />
                  <ResourceCard
                    title="Science Lab Safety"
                    category="Science"
                    description="Essential safety guidelines for experiments"
                    uploadedBy="Dr. Chen"
                    uploadDate="Jan 20, 2024"
                    fileType="PDF"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-foreground font-display">Recent Discussions</h3>
                  <Button variant="outline" data-testid="button-view-all-discussions">
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  <DiscussionThread
                    title="How do I solve quadratic equations?"
                    author="Sarah M."
                    content="I'm having trouble understanding the quadratic formula. Can someone explain the steps?"
                    category="Mathematics"
                    replies={8}
                    likes={12}
                    timestamp="3 hours ago"
                  />
                  <DiscussionThread
                    title="Best study techniques for history exams?"
                    author="Mike T."
                    content="What are effective methods for memorizing historical dates and events?"
                    category="History"
                    replies={15}
                    likes={24}
                    timestamp="1 day ago"
                  />
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
