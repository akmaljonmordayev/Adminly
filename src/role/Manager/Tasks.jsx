import React, { useState } from "react";

const employeesList = [
  "Ali",
  "Xojar",
  "Bilol",
  "Qodir",
  "Akrom",
  "Mohi",
  "Azamat",
  "Abdulloh",
];

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [employee, setEmployee] = useState("");

  const addTask = () => {
    if (!title || !employee) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title,
        employee,
        status: "Pending",
      },
    ]);

    setTitle("");
    setEmployee("");
  };

  const updateStatus = (id, status) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  const statusColors = {
    Pending:
      "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-300",
    "In Progress":
      "bg-blue-100 text-blue-700 ring-1 ring-blue-300",
    Done:
      "bg-green-100 text-green-700 ring-1 ring-green-300",
  };

  return (
    <div className="min-h-screen  from-slate-100 to-slate-200 p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800">
            Task Management
          </h1>
          <p className="text-slate-500 mt-2">
            Manager ish biriktiradi, employee statusni yangilaydi
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
            ➕ Yangi task qo‘shish
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Task nomi..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="md:col-span-2 px-5 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <select
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              className="px-5 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Employee tanlang</option>
              {employeesList.map((emp) => (
                <option key={emp}>{emp}</option>
              ))}
            </select>

            <button
              onClick={addTask}
              className="bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition shadow-lg"
            >
              Add Task
            </button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center text-slate-500 mt-20">
            <p className="text-xl">📭 Tasklar mavjud emas</p>
            <p className="text-sm mt-1">
              Yangi task qo‘shishdan boshlang
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="group bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition relative overflow-hidden"
              >
                <div className="absolute inset-0  from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    {task.title}
                  </h3>

                  <p className="text-sm text-slate-500 mb-4">
                    👤 {task.employee}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusColors[task.status]}`}
                    >
                      {task.status}
                    </span>

                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateStatus(task.id, e.target.value)
                      }
                      className="px-3 py-1.5 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;
