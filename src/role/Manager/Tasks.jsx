import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { DatePicker } from "antd";
import { FaMagnifyingGlass } from "react-icons/fa6";
import axios from "axios";
import dayjs from "dayjs";
import {
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineStatusOnline,
} from 'react-icons/hi'

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

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const filteredTasks = [...tasks]
    .filter((task) =>
      task.taskName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "A-Z") {
        return a.taskName.localeCompare(b.taskName);
      }
      if (sortOrder === "Z-A") {
        return b.taskName.localeCompare(a.taskName);
      }

      if (sortOrder === "DATE-ASC") {
        return dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf();
      }
      if (sortOrder === "DATE-DESC") {
        return dayjs(b.deadline).valueOf() - dayjs(a.deadline).valueOf();
      }
      return 0;
    });

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

    toast.success("Task successfully added");

    setTaskName("");
    setEmployeeName("");
    setDeadline("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    let res = await axios.get(`http://localhost:5000/tasks/${id}`);
    await axios.post(`http://localhost:5000/tasksDeleted`, res.data);
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    toast.error("Task successfully deleted and achieved");
    fetchTasks();
  };

  const updateStatus = async (id, status) => {
    const currentTask = tasks.find((t) => t.id === id);

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...currentTask, status }),
    });

    fetchTasks();
  };

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

    toast.success("Task updated");
    setEditingId(null);
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

        <div className="bg-[#0f172a] p-6 rounded-3xl mb-10">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              placeholder="Task nomi"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#020617] border border-slate-700"
            />

            <select
              onChange={(e) => setEmployeeName(e.target.value)}
              className="bg-[#020617] border border-slate-700 rounded-lg px-2 mr-12 py-1 w-full"
            >
              <option value="">Employee tanlang</option>
              {fullnames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
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

        <div className="p-5 rounded-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(0,0,0,0.6)] bg-gradient-to-r from-slate-900 to-slate-800 border border-white/10">
          <div className="relative w-full">
            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full bg-[#020617] rounded-lg px-2 mr-16 py-3 pl-10"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tasklarni qidirish..."
            />
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-[#020617] border border-slate-700 rounded-lg px-2 py-3 w-full"
          >
            <option value="">Sort by name</option>
            <option value="A-Z">A - Z</option>
            <option value="Z-A">Z - A</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-[#020617] border border-slate-700 rounded-lg px-2 py-3 w-full"
          >
            <option value="">Sort by date</option>
            <option value="DATE-ASC">Date ⬆️</option>
            <option value="DATE-DESC">Date ⬇️</option>
          </select>
        </div>

        <ToastContainer position="top-right" autoClose={2000} theme="dark" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {filteredTasks.length === 0 ? (
            <h1 className="text-center col-span-full mt-4 text-xl tracking-[0.3em] text-cyan-400 animate-pulse">
              Task not found
            </h1>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="bg-[#0f172a] p-6 rounded-3xl">
                {editingId === task.id ? (
                  <div className="space-y-3">
                    <input
                      value={editTaskName}
                      onChange={(e) => setEditTaskName(e.target.value)}
                      className="w-full bg-[#020617] border border-slate-700 rounded-lg px-3 py-2"
                    />

                    <select
                      value={editEmployeeName}
                      onChange={(e) => setEditEmployeeName(e.target.value)}
                      className="w-full bg-[#020617] border border-slate-700 rounded-lg px-3 py-2"
                    >
                      {fullnames.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>

                    <DatePicker
                      value={editDeadline ? dayjs(editDeadline) : null}
                      onChange={(d, ds) => setEditDeadline(ds)}
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <h3 className="text-xl text-cyan-100 flex items-center gap-2">
                      <HiOutlineClipboardList className="text-cyan-300" />{task.taskName}
                    </h3>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <HiOutlineUser className="text-cyan-300"/> {task.employeeName}
                    </p>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                     <HiOutlineCalendar className="text-cyan-300"/> {task.deadline}</p>
                  </div>
                )}

                <p
                  className={`mt-1 flex items-center gap-2 right-3 font-semibold ${statusColors[task.status]}`}
                >
                  <HiOutlineStatusOnline className="flex text-xl text-cyan-300"/>
                  {task.status}
                </p>

                <div className="flex gap-2 mt-4 items-center">
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
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg w-20"
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
