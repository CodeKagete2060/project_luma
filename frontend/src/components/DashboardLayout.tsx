import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NotificationBell from "./NotificationBell";

export default function DashboardLayout({ children, role }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  }

  // Role-specific navigation items
  const getNavItems = () => {
    const baseItems = [
      { path: "/learning/resources", label: "Resources", icon: "R" },
      { path: "/learning/assistant", label: "AI Assistant", icon: "A" },
      { path: "/discussions", label: "Discussions", icon: "D" },
      { path: "/search", label: "Smart Search", icon: "S" },
    ];

    if (role === "student") {
      return [
        { path: "/student-dashboard", label: "Dashboard", icon: "H" },
        ...baseItems,
        { path: "/learning/sessions", label: "Sessions", icon: "S" },
      ];
    } else if (role === "parent") {
      return [
        { path: "/parent-dashboard", label: "Dashboard", icon: "H" },
        ...baseItems,
      ];
    } else if (role === "tutor") {
      return [
        { path: "/tutor-dashboard", label: "Dashboard", icon: "H" },
        ...baseItems,
        { path: "/learning/sessions/start", label: "Start Session", icon: "S" },
        { path: "/learning/sessions", label: "Sessions", icon: "S" },
      ];
    } else if (role === "admin") {
      return [
        { path: "/admin-dashboard", label: "Dashboard", icon: "H" },
        { path: "/admin/users", label: "Users", icon: "U" },
        { path: "/admin/resources", label: "Resources", icon: "R" },
        { path: "/admin/analytics", label: "Analytics", icon: "A" },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-light text-gray-800">
      <header className="bg-primary text-white shadow-md">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 rounded-md bg-white/20"
                onClick={() => setOpen((s) => !s)}
                aria-label="Toggle menu"
              >
                Menu
              </button>
              <Link to="/" className="font-bold text-white text-xl">
                G-LEARNEX
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <NotificationBell userId={user.id || user._id} />
              <div className="hidden md:flex md:items-center md:gap-4">
                <span className="text-sm text-white/90">{user.name || user.username || "Guest"}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - 2/10 width (20%) */}
        <aside
          className={`bg-white border-r shadow-sm w-1/5 min-w-[200px] p-4 space-y-2 hidden md:block overflow-y-auto`}
          aria-label="Sidebar"
        >
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-4 py-3 rounded-lg hover:bg-primary/10 text-gray-700 hover:text-primary transition-colors"
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content - 8/10 width (80%) */}
        <main className="flex-1 overflow-y-auto bg-light p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 py-2 flex gap-2 md:hidden z-50">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex-1 text-center px-2 py-2 rounded-lg hover:bg-primary/10 text-gray-700 text-xs"
          >
            <div className="text-lg">{item.icon}</div>
            <div className="text-xs mt-1">{item.label.split(" ")[0]}</div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
