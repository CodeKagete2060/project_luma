import { Home, BookOpen, MessageSquare, Users, Bell, Settings, LogOut, GraduationCap, BarChart3, Shield } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  role: "student" | "parent" | "tutor" | "admin";
  userName: string;
  userAvatar?: string;
}

export function AppSidebar({ role, userName, userAvatar }: AppSidebarProps) {
  const getMenuItems = () => {
    switch (role) {
      case "student":
        return [
          { title: "Dashboard", url: "/student/dashboard", icon: Home },
          { title: "AI Assistant", url: "/student/ai-helper", icon: GraduationCap },
          { title: "Study Resources", url: "/student/resources", icon: BookOpen },
          { title: "Discussions", url: "/student/discussions", icon: MessageSquare },
          { title: "Notifications", url: "/student/notifications", icon: Bell },
        ];
      case "parent":
        return [
          { title: "Dashboard", url: "/parent/dashboard", icon: Home },
          { title: "Child Progress", url: "/parent/progress", icon: BarChart3 },
          { title: "Activity Feed", url: "/parent/activity", icon: Bell },
          { title: "Resources", url: "/parent/resources", icon: BookOpen },
          { title: "Messages", url: "/parent/messages", icon: MessageSquare },
        ];
      case "tutor":
        return [
          { title: "Dashboard", url: "/tutor/dashboard", icon: Home },
          { title: "My Students", url: "/tutor/students", icon: Users },
          { title: "Resources", url: "/tutor/resources", icon: BookOpen },
          { title: "Discussions", url: "/tutor/discussions", icon: MessageSquare },
          { title: "Schedule", url: "/tutor/schedule", icon: Bell },
        ];
      case "admin":
        return [
          { title: "Dashboard", url: "/admin/dashboard", icon: Home },
          { title: "Moderation", url: "/admin/moderation", icon: Shield },
          { title: "Users", url: "/admin/users", icon: Users },
          { title: "Content", url: "/admin/content", icon: BookOpen },
          { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground font-bold text-lg">
            L
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">LUMA</h2>
            <p className="text-xs text-muted-foreground capitalize">{role} Portal</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover-elevate" data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-md bg-card border border-card-border">
          <Avatar className="w-10 h-10">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground">{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="flex-1" data-testid="button-settings">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="flex-1" data-testid="button-logout">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
