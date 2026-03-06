import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineCalendar,
} from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [sort, setSort] = useState("a-z");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const employeeName = user?.name?.trim()?.toLowerCase();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tasks");

        const currentUserName = (user?.name || user?.fullName)?.trim()?.toLowerCase() || "";

        const filteredTasks = res.data.filter(
          (task) =>
            task.employeeName?.trim()?.toLowerCase() === currentUserName &&
            task.deadline?.startsWith(selectedYear)
        );

        setTasks(filteredTasks);
      } catch (err) {
        console.log("ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedYear]);

  const filteredData = useMemo(() => {
    let result = [...tasks];

    if (search.trim() !== "") {
      result = result.filter((task) =>
        task?.taskName?.toLowerCase()?.includes(search.trim().toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (task) =>
          task?.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    result.sort((a, b) =>
      sort === "a-z"
        ? a.taskName.localeCompare(b.taskName)
        : b.taskName.localeCompare(a.taskName)
    );

    return result;
  }, [tasks, search, statusFilter, sort]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/tasks/${taskId}`, {
        status: newStatus,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      if (selectedTask?.id === taskId) {
        setSelectedTask((prev) => ({ ...prev, status: newStatus }));
      }

      toast.success("Status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Status update failed");
    }
  };

  if (loading) return <p className="text-[var(--text-primary)] p-6">Loading Tasks...</p>;

  return (
    <div className="p-10 bg-[var(--bg-primary)] min-h-screen">
      <ToastContainer theme="dark" position="top-right" />

      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-[var(--text-primary)] italic tracking-tighter">
          YOUR <span className="text-cyan-400">TASKS</span>
        </h1>

        <div className="flex items-center gap-3 bg-cyan-500/5 p-1 rounded-2xl border border-cyan-500/10">
          {["2025", "2026"].map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${selectedYear === y
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
            >
              {y} Year
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-5 mb-16 bg-[var(--card-bg)]/40 p-6 rounded-[2rem] border border-cyan-500/10">
        <input
          type="text"
          placeholder="SEARCH TASKS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[var(--bg-secondary)]/50 border border-slate-700/50 px-6 py-4 rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-500 transition-all font-bold text-xs uppercase tracking-widest"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-[var(--bg-secondary)]/50 border border-slate-700/50 px-6 py-4 rounded-xl text-cyan-400 outline-none font-black text-xs uppercase"
        >
          <option value="a-z">SORT: A-Z</option>
          <option value="z-a">SORT: Z-A</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[var(--bg-secondary)]/50 border border-slate-700/50 px-6 py-4 rounded-xl text-cyan-400 outline-none font-black text-xs uppercase"
        >
          <option value="all">ALL STATUS</option>
          <option value="pending">PENDING</option>
          <option value="in process">IN PROCESS</option>
          <option value="completed">COMPLETED</option>
        </select>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {filteredData.map((task) => (
          <div
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className="group relative cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-[var(--card-bg)] border border-cyan-500/10 rounded-[2rem] p-8 h-full flex flex-col hover:border-purple-500/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-500/10 rounded-xl border border-white/5 text-purple-400 group-hover:scale-110 transition-transform">
                  <HiOutlineClipboardList className="text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] ml-4 line-clamp-1 italic tracking-tight">
                  {task.taskName}
                </h3>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-center gap-4">
                  <HiOutlineUser className="text-[var(--text-secondary)] text-lg" />
                  <div>
                    <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">Assigned To</p>
                    <p className="text-slate-200 font-bold text-sm tracking-tight">{task.employeeName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <HiOutlineCalendar className="text-[var(--text-secondary)] text-lg" />
                  <div>
                    <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">Target Deadline</p>
                    <p className="text-rose-400 font-bold text-sm tracking-tight">{task.deadline}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <select
                  value={task.status || "pending"}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className={`w-full bg-[#101827] border border-slate-700/50 py-3 rounded-xl px-4 text-xs font-black uppercase tracking-widest outline-none focus:border-cyan-500 transition-all ${task.status === "completed" ? "text-emerald-400" : "text-cyan-400"
                    }`}
                >
                  <option value="pending">PENDING</option>
                  <option value="in process">IN PROCESS</option>
                  <option value="completed">COMPLETED</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="max-w-6xl mx-auto py-32 flex flex-col items-center justify-center text-center bg-[var(--card-bg)]/20 border border-dashed border-cyan-500/10 rounded-[3rem] mb-20">
          <div className="w-24 h-24 mb-6 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500/50">
            <HiOutlineClipboardList size={48} />
          </div>
          <h2 className="text-2xl font-black text-[var(--text-primary)] italic tracking-tighter mb-2">ALL CAUGHT UP!</h2>
          <p className="text-[var(--text-secondary)] font-bold uppercase tracking-[0.2em] text-xs max-w-md mx-auto">
            CURRENTLY NO TASKS ASSIGNED TO YOU FOR {selectedYear}. ENJOY YOUR FREE TIME OR CHECK BACK LATER.
          </p>
        </div>
      )}

      {selectedTask && (
        <div
          className="fixed inset-0 bg-[var(--bg-secondary)]/90 backdrop-blur-xl flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-[var(--card-bg)] border border-cyan-500/10 w-full max-w-lg rounded-[3rem] p-10 relative animate-in zoom-in duration-300 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setSelectedTask(null)} className="absolute top-8 right-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
              ✕
            </button>
            <h2 className="text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase mb-4">
              CORE TASK DETAIL
            </h2>
            <h3 className="text-2xl font-black text-[var(--text-primary)] mb-10 italic tracking-tighter">
              {selectedTask.taskName}
            </h3>

            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">Assignee</span>
                <span className="text-[var(--text-primary)] font-bold tracking-tight">{selectedTask.employeeName}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">Final Deadline</span>
                <span className="text-rose-400 font-bold tracking-tight">{selectedTask.deadline}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">Current Status</span>
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black bg-cyan-500/10 text-cyan-400 uppercase tracking-widest">
                  {selectedTask.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTasks;
