import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { DatePicker } from "antd";

const API_URL = "http://localhost:5000/tasks";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [taskName, setTaskName] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [deadline, setDeadline] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editEmployeeName, setEditEmployeeName] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  /* ================= FETCH ================= */

  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };


  const fetchEmployees = async () => {
    const res = await fetch("http://localhost:5000/employees");
    const data = await res.json();
    setEmployees(data);
  };

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fullnames = employees.map((e) => e.fullName);

  /* ================= ADD ================= */

  const addTask = async () => {
    if (!taskName || !employeeName || !deadline) {
      toast.error("Iltimos barcha maydonlarni to‘ldiring");
      return;
    }

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskName,
        employeeName,
        deadline,
        status: "pending",
        
      }),
    });

    toast.success("Task qo‘shildi");
    setTaskName("");
    setEmployeeName("");
    setDeadline("");
    fetchTasks();
  };

  /* ================= DELETE ================= */

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    toast.error("Task o‘chirildi");
    fetchTasks();
  };

  /* ================= STATUS ================= */

  const updateStatus = async (id, status) => {
    const currentTask = tasks.find((t) => t.id === id);

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...currentTask, status }),
    });

    fetchTasks();
  };

  /* ================= EDIT ================= */

  const saveEdit = async (id) => {
    const currentTask = tasks.find((t) => t.id === id);

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...currentTask,
        taskName: editTaskName,
        employeeName: editEmployeeName,
        deadline: editDeadline,
      }),
    });

    toast.success("Task yangilandi");
    setEditingId(null);
    fetchTasks();
  };

  const statusColors = {
    pending: "text-yellow-400",
    "in progress": "text-blue-400",
    done: "text-green-400",
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0b1220] p-8 text-slate-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8">
          Task Management
        </h1>

        {/* ADD TASK */}
        <div className="bg-[#0f172a] p-6 rounded-3xl mb-10">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              placeholder="Task nomi"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="input"
            />

            <select
              onChange={(e) => setEmployeeName(e.target.value)}
              className="input"
            >
              <option value="">Employee tanlang</option>
              {fullnames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <DatePicker
              className="input h-12"
              onChange={(d, ds) => setDeadline(ds)}
            />

            <button
              onClick={addTask}
              className="bg-cyan-500 text-black rounded-xl font-semibold"
            >
              Add Task
            </button>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={2000} theme="dark" />

        {/* TASK LIST */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tasks.map((task) => (
            <div key={task.id} className="bg-[#0f172a] p-6 rounded-3xl">

              {/* EDIT / VIEW */}
              {editingId === task.id ? (
                <div className="space-y-3">
                  <input
                    value={editTaskName}
                    onChange={(e) => setEditTaskName(e.target.value)}
                    className="input"
                  />

                  <select
                    value={editEmployeeName}
                    onChange={(e) => setEditEmployeeName(e.target.value)}
                    className="input"
                  >
                    {fullnames.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>

                  <DatePicker
                    className="input"
                    onChange={(d, ds) => setEditDeadline(ds)}
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <h3 className="text-lg text-cyan-300">📝 {task.taskName}</h3>
                  <p className="text-sm text-slate-400">👤 {task.employeeName}</p>
                  <p className="text-sm text-slate-400">📅 {task.deadline}</p>
                </div>
              )}

              <p className={`mt-2 font-semibold ${statusColors[task.status]}`}>
                {task.status}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4">
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value)}
                  className="input py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                {editingId === task.id ? (
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="btn-green"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(task.id);
                      setEditTaskName(task.taskName);
                      setEditEmployeeName(task.employeeName);
                      setEditDeadline(task.deadline);
                    }}
                    className="btn-blue"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteTask(task.id)}
                  className="btn-red"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
