import DashboardLayout from "../components/DashboardLayout";

export default function ParentDashboard() {
  const dummy = {
    child: { name: "Ava Johnson", grade: "Grade 7", avg: 82 },
    recentReports: [
      { title: "Math Progress", desc: "Improved test scores in algebra.", date: "2025-10-01" },
      { title: "Reading", desc: "Needs more practice on comprehension.", date: "2025-10-12" },
    ],
    notifications: [
      { from: "Mr. B", msg: "Scheduled extra help on Thursdays." },
      { from: "Ms. A", msg: "Positive behavior in class." },
    ],
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Parent Dashboard</h1>
            <p className="text-sm text-gray-500">Track your child's progress and recent teacher comments.</p>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm text-gray-500">Child</h3>
            <div className="mt-2">
              <div className="text-lg font-semibold text-gray-800">{dummy.child.name}</div>
              <div className="text-sm text-gray-500">{dummy.child.grade} • Avg: <span className="text-blue-600">{dummy.child.avg}%</span></div>
              <button className="mt-3 px-3 py-1 bg-blue-600 text-white rounded" onClick={() => alert('View report (dummy)')}>
                View Child's Report
              </button>
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Notifications</h3>
            <ul className="space-y-3">
              {dummy.notifications.map((n, i) => (
                <li key={i} className="p-3 border rounded">
                  <div className="text-sm text-gray-700">{n.msg}</div>
                  <div className="text-xs text-gray-400 mt-1">From: {n.from}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dummy.recentReports.map((r, i) => (
              <div key={i} className="p-3 border rounded">
                <div className="text-sm font-semibold text-gray-800">{r.title}</div>
                <div className="text-xs text-gray-500">{r.date}</div>
                <div className="text-sm text-gray-700 mt-2">{r.desc}</div>
                <button className="mt-3 px-2 py-1 text-sm bg-gray-100 rounded" onClick={() => alert('Open report (dummy)')}>
                  Open
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
