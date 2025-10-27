import DashboardLayout from "../components/DashboardLayout";
import { LineChart } from "../components/LineChart";

function ProgressCard({ title, value, bg = "bg-white" }) {
  return (
    <div className={`p-4 rounded-lg shadow-sm ${bg}`}>
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="text-2xl font-semibold text-blue-600 mt-2">{value}</p>
    </div>
  );
}

export default function StudentDashboard() {
  // Dummy data
  const stats = {
    assignmentsCompleted: 18,
    totalAssignments: 22,
    subjects: ["Math", "English", "Science"],
    recentFeedback: [
      { by: "Ms. A", msg: "Great improvement in algebra!" },
      { by: "Mr. B", msg: "Keep practicing reading comprehension." },
    ],
    performanceTrend: [
      { week: "W1", score: 68 },
      { week: "W2", score: 72 },
      { week: "W3", score: 80 },
      { week: "W4", score: 84 },
    ],
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back — here's your learning summary.</p>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <ProgressCard title="Assignments Completed" value={`${stats.assignmentsCompleted}/${stats.totalAssignments}`} />
          <ProgressCard title="Active Subjects" value={stats.subjects.length} />
          <ProgressCard title="Current Level" value={`Level ${Math.ceil(stats.assignmentsCompleted / 5)}`} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Trend</h3>
            <div className="h-56">
              <LineChart
                data={stats.performanceTrend}
                color="#2563eb"
                height={240}
                showGrid={true}
              />
            </div>
            <p className="text-sm text-gray-500 mt-4">Weekly performance trends</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Feedback</h3>
            <ul className="space-y-3">
              {stats.recentFeedback.map((f, i) => (
                <li key={i} className="p-2 rounded border">
                  <div className="text-sm text-gray-600">{f.msg}</div>
                  <div className="text-xs text-gray-400 mt-1">— {f.by}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
