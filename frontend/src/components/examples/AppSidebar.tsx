import { AppSidebar } from "../layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="student" userName="Alex Johnson" />
        <div className="flex-1 p-8 bg-background">
          <p className="text-muted-foreground">Main content area - Sidebar example</p>
        </div>
      </div>
    </SidebarProvider>
  );
}
