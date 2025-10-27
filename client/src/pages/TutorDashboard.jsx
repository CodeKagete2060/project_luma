import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function TutorDashboard() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([
    { student: "Ava Johnson", title: "Algebra practice", due: "2025-10-30" },
    { student: "Liam Smith", title: "Essay draft", due: "2025-11-02" },
  ]);

  const classStats = {
    average: 79,
    students: 24,
  };

  function addTask(e) {
    e.preventDefault();
    if (!task.trim()) return;
    setTasks((t) => [{ student: "All", title: task, due: "TBD" }, ...t]);
    setTask("");
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tutor Dashboard</h1>
            <p className="text-sm text-gray-500">Overview of student progress and quick task assignment.</p>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm text-gray-500">Class Average</h3>
            <div className="text-3xl font-bold text-blue-600">{classStats.average}%</div>
            <div className="text-xs text-gray-500 mt-1">{classStats.students} students</div>
          </div>

          <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Assign Task</h3>
            <form onSubmit={addTask} className="flex gap-2">
              <input
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Task title or instructions"
              />
              <button className="px-3 py-1 bg-blue-600 text-white rounded">Assign</button>
            </form>

            <div className="mt-4">
              <h4 className="text-sm text-gray-600 mb-2">Recent Assignments</h4>
              <ul className="space-y-2">
                {tasks.map((t, i) => (
                  <li key={i} className="p-3 border rounded flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold">{t.title}</div>
                      <div className="text-xs text-gray-500">For: {t.student} • Due: {t.due}</div>
                    </div>
                    <button className="text-sm text-blue-600">Edit</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded">
              <div className="text-sm text-gray-500">Top Performer</div>
              <div className="text-lg font-semibold text-gray-800">Ava Johnson • 92%</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-sm text-gray-500">Needs Attention</div>
              <div className="text-lg font-semibold text-gray-800">2 students</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-sm text-gray-500">Avg Improvement</div>
              <div className="text-lg font-semibold text-gray-800">+4%</div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
