import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const API_URL = "http://localhost:5000/tasks";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [deadline, setDeadline] = useState("");

  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!taskName || !employeeName || !deadline) {
      toast.error("Iltimos task kirgizing!!");
      return;
    }
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskName,
        employeeName,
        status: "pending",
        deadline,
      }),
    });

    toast.success("Task successfully added");

    setTaskName("");
    setEmployeeName("");
    setDeadline("");
    fetchTasks();
  };

  const updateStatus = async (id, status) => {
    const task = tasks.find((t) => t.id === id);

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, status }),
    });

    fetchTasks();
  };

  const deleteTask = async (id) => {
    let res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Task successfully deleted");
    }

    fetchTasks();
  };

  const statusColors = {
    pending: "text-yellow-400",
    "in progress": "text-blue-400",
    done: "text-green-400",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0b1220] p-8 text-slate-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8">
          Task Management
        </h1>

        <div className="bg-[#0f172a] p-6 rounded-3xl mb-10 shadow-lg">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              placeholder="Task nomi"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#020617] border border-slate-700"
            />

            <input
              placeholder="Employee"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#020617] border border-slate-700"
            />

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#020617] border border-slate-700"
            />

            <button
              onClick={addTask}
              className="bg-cyan-500 text-black rounded-xl font-semibold hover:bg-cyan-400"
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#0f172a] p-6 rounded-3xl shadow-md"
            >
              <h3 className="text-lg font-semibold text-cyan-300">
                {task.taskName}
              </h3>

              <p className="text-slate-400 text-sm">👤 {task.employeeName}</p>

              <p className="text-slate-400 text-sm">📅 {task.deadline}</p>

              <p className={`mt-2 font-semibold ${statusColors[task.status]}`}>
                {task.status}
              </p>

              <div className="flex gap-2 mt-4">
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value)}
                  className="flex-1 bg-[#020617] border border-slate-700 rounded-lg px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                >
                  Delete
                </button>
              </div>
              <ToastContainer
                position="top-right"
                autoClose={2000}
                theme="dark"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
