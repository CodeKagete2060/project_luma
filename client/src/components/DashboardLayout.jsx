import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 rounded-md bg-gray-100"
                onClick={() => setOpen((s) => !s)}
                aria-label="Toggle menu"
              >
                ☰
              </button>
              <Link to="/" className="font-semibold text-blue-600 text-lg">
                Luma
              </Link>
              <span className="text-sm text-gray-500">| Dashboard</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex md:items-center md:gap-4">
                <span className="text-sm text-gray-600">{user?.name || "Guest"}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`bg-white w-64 border-r p-4 space-y-4 hidden md:block`}
          aria-label="Sidebar"
        >
          <nav className="space-y-2">
            <Link to="/student" className="block px-3 py-2 rounded hover:bg-blue-50">
              Student
            </Link>
            <Link to="/parent" className="block px-3 py-2 rounded hover:bg-blue-50">
              Parent
            </Link>
            <Link to="/tutor" className="block px-3 py-2 rounded hover:bg-blue-50">
              Tutor
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg px-4 py-2 flex gap-2 md:hidden">
        <Link to="/student" className="text-sm text-gray-700 px-3 py-1">
          Student
        </Link>
        <Link to="/parent" className="text-sm text-gray-700 px-3 py-1">
          Parent
        </Link>
        <Link to="/tutor" className="text-sm text-gray-700 px-3 py-1">
          Tutor
        </Link>
      </nav>
    </div>
  );
}
