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
  const [sort, setSort] = useState("a-z");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const employeeName = user?.fullName?.trim().toLowerCase();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tasks");

        const filteredTasks = res.data.filter(
          (task) =>
            task.employeeName &&
            task.employeeName.trim().toLowerCase() === employeeName
        );

        setTasks(filteredTasks);
      } catch (err) {
        console.log("ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    if (employeeName) fetchTasks();
  }, [employeeName]);

  const filteredData = useMemo(() => {
    let result = [...tasks];

    if (search.trim() !== "") {
      result = result.filter((task) =>
        task?.taskName?.toLowerCase().includes(search.trim().toLowerCase())
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

  // ✅ FIXED STATUS UPDATE
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

      // modal ochiq bo‘lsa ham yangilash
      if (selectedTask?.id === taskId) {
        setSelectedTask((prev) => ({ ...prev, status: newStatus }));
      }

      toast.success("Status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Status update failed");
    }
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="p-10 bg-[#0b1220] min-h-screen text-slate-100 flex flex-col items-center">
      <ToastContainer theme="dark" position="top-right" />

      <div>
        <h1 className="text-center text-[35px] font-bold mr-[100px] mt-[10px] mb-[20px] text-slate-200 font-extrabold ">
          Tasks
        </h1>
        <p className="font-extrabold fixed top-[620px] right-[50px] z-50 p-[5px] text-[20px] font-bold mt-[10px] mb-[20px] bg-[#0b1220] text-blue-300 w-[150px] h-[40px] shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_60px_rgba(56,189,248,0.2)] hover:-translate-y-1 transition-all duration-300 flex justify-center items-center rounded-[20px]">
          My tasks ({filteredData.length})
        </p>
      </div>

      <div className="flex justify-center gap-5 mb-10">
        <input
          type="text"
          placeholder="Search by task name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="font-extrabold w-[650px] h-[60px] px-5 rounded-2xl text-[18px] bg-gradient-to-br from-[#0f172a] to-[#020617] shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_60px_rgba(56,189,248,0.2)] hover:-translate-y-1 transition-all duration-300"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="font-extrabold w-[100px] text-white/70 p-3 rounded-2xl bg-[#020617] shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_60px_rgba(56,189,248,0.2)] hover:-translate-y-1 transition-all duration-300"
        >
          <option value="a-z">A-Z</option>
          <option value="z-a">Z-A</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="font-extrabold p-3 text-white/70 rounded-2xl bg-[#020617] shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_60px_rgba(56,189,248,0.2)] hover:-translate-y-1 transition-all duration-300"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in process">In process</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredData.length === 0 ? (
        <p className="text-slate-400 font-extrabold text-center mt-10">
          No tasks found
        </p>
      ) : (
        <ul className="flex flex-wrap gap-15">
          {filteredData.map((task, index) => (
            <li
              key={`${task.id}-${index}`}  // ✅ duplicate key fix
              onClick={() => setSelectedTask(task)}
              className="relative cursor-pointer p-6 rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#020617] shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_60px_rgba(56,189,248,0.2)] hover:-translate-y-1 transition-all duration-300 w-[340px] h-[300px] flex flex-col gap-[15px] justify-center"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 font-extrabold bg-white/5 rounded-xl border border-white/10 text-cyan-400">
                  <HiOutlineClipboardList className="text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-white ml-4">
                  {task.taskName.length > 20
                    ? task.taskName.slice(0, 20) + "..."
                    : task.taskName}
                </h3>
              </div>

              <div className="flex flex-col gap-4 mb-4">
                <div className="flex gap-3 items-center font-extrabold">
                  <HiOutlineUser className="text-gray-500 text-lg" />
                  <div>
                    <p className="text-sm text-slate-400">Assigned Employee</p>
                    <p className="text-slate-200 font-medium">
                      {task.employeeName}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-center font-extrabold">
                  <HiOutlineCalendar className="text-gray-500 text-lg" />
                  <div>
                    <p className="text-sm text-slate-400">Deadline</p>
                    <p className="text-slate-200 font-medium">
                      {task.deadline}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <select
                  value={task.status || "pending"}   // ✅ FIX
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    handleStatusChange(task.id, e.target.value)
                  }
                  className="text-cyan-400 font-extrabold font-medium p-[5px] rounded-[10px] bg-[#101827]"
                >
                  <option value="pending">Pending</option>
                  <option value="in process">In process</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="relative w-full max-w-2xl">
            <div className="absolute -inset-1 bg-cyan-500/20 blur-2xl rounded-3xl"></div>
            <div className="relative bg-[#0b1220] border border-cyan-400/40 rounded-3xl p-10 shadow-2xl">
              <button
                onClick={() => setSelectedTask(null)}
                className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>

              <h2 className="text-cyan-400 text-xl font-semibold text-start mb-8 tracking-wide">
                Employee Task
              </h2>

              <p className="text-cyan-300 text-start text-center mb-10 break-all">
                {selectedTask.taskName}
              </p>

              <div className="space-y-8 text-slate-200">
                <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                  <span className="text-slate-400">Assigned Employee</span>
                  <span className="font-medium">
                    {selectedTask.employeeName}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                  <span className="text-slate-400">Deadline</span>
                  <span className="font-medium">{selectedTask.deadline}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status</span>
                  <span className="px-4 py-1.5 rounded-full text-sm bg-cyan-500/20 text-cyan-400 border border-cyan-400/40">
                    {selectedTask.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTasks;
