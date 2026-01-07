import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { DatePicker } from "antd";

const API_URL = "http://localhost:5000/tasks";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editEmployeeName, setEditEmployeeName] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  const saveEdit = async (id) => {
    const task = tasks.find((t) => t.id === id);

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...task,
        taskName: editTaskName,
        employeeName: editEmployeeName,
        deadline: editDeadline,
      }),
    });
    toast.success("Task updated");
    setEditingId(null);
    fetchTasks();
  };

  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  const fetchEmployees = async () => {
    const res = await fetch("http://localhost:5000/employees");
    const data = await res.json();
    setEmployee(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  let fullnames = [];

  employee.forEach((item) => {
    fullnames.push(item.fullName);
  });

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

  const deleteTask = async (id) => {
    let res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.error("Task successfully deleted");
    }

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



  const statusColors = {
    pending: "text-yellow-400",
    "in progress": "text-blue-400",
    done: "text-green-400",
  };

  const onChange = (date, dateString) => {
    setDeadline(dateString);
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

            <select
              className="text-white bg-[#020617] rounded-xl py-3 border border-slate-700"
              onChange={(e) => setEmployeeName(e.target.value)}
              name=""
              id=""
            >
              {fullnames.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </select>

            <DatePicker
              className="bg-[#020617] border border-slate-700 rounded-xl h-14 px-4"
              ClassName="bg-[#020617] text-white"
              onChange={onChange}
            />

            <button
              onClick={addTask}
              className="bg-cyan-500 text-black rounded-xl font-semibold hover:bg-cyan-400"
            >
              Add Task
            </button>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={2000} theme="dark" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#0f172a] p-6 rounded-3xl shadow-md"
            >
              {editingId === task.id ? (
                <input
                  value={editTaskName}
                  onChange={(e) => setEditTaskName(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-lg px-3 py-2"
                />
              ) : (
                <h3 className="text-lg font-semibold text-cyan-300">
                  📝 {task.taskName}
                </h3>
              )}

              {editingId === task.id ? (
                <select
                  value={editEmployeeName}
                  onChange={(e) => setEditEmployeeName(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-lg px-3 py-2"
                >
                  {fullnames.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-slate-400 text-sm">👤 {task.employeeName}</p>
              )}

              {editingId === task.id ? (
                <DatePicker
                  className="w-full"
                  onChange={(d, ds) => setEditDeadline(ds)}
                />
              ) : (
                <p className="text-slate-400 text-sm">📅 {task.deadline}</p>
              )}

              <p className={`mt-2 font-semibold ${statusColors[task.status]}`}>
                {task.status}
              </p>

              <div className="flex gap-2 mt-4">
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value)}
                  className="bg-[#020617] border border-slate-700 rounded-lg px-2 mr-12 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                {editingId === task.id ? (
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg"
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
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg w-18"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg"
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
