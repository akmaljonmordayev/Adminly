import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineCalendar,
} from "react-icons/hi";

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
            task.employeeName.trim().toLowerCase() === employeeName,
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
        task?.taskName?.toLowerCase().includes(search.trim().toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (task) => task?.status?.toLowerCase() === statusFilter,
      );
    }

    result.sort((a, b) => {
      if (sort === "a-z") {
        return a.taskName.localeCompare(b.taskName);
      } else {
        return b.taskName.localeCompare(a.taskName);
      }
    });

    return result;
  }, [tasks, search, statusFilter, sort]);

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="p-10 bg-[#0b1220] min-h-screen text-slate-100 flex flex-col items-center">
      <div>
        <h1 className="text-center text-[35px] font-bold mr-[100px] mt-[10px] mb-[20px] text-slate-200 font-extrabold ">
          Tasks
        </h1>

        <p className="font-extrabold  fixed top-[560px] right-[40px] z-50 p-[5px] text-[20px] font-bold mt-[10px] mb-[20px] bg-[#0b1220] text-blue-300 w-[150px] h-[40px] shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_60px_rgba(56,189,248,0.2)] hover:-translate-y-1 transition-all duration-300 flex justify-center items-center rounded-[20px]">
          My tasks ({filteredData.length})
        </p>
      </div>

      <div className="flex justify-center gap-5 mb-10">
        <input
          type="text"
          placeholder="Search by task name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="font-extrabold  w-[650px] h-[60px] px-5 rounded-2xl text-[18px] bg-gradient-to-br from-[#0f172a] to-[#020617] shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_60px_rgba(56,189,248,0.2)] hover:-translate-y-1 transition-all duration-300"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="font-extrabold  w-[100px] text-white/70 p-3 rounded-2xl bg-[#020617] shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_60px_rgba(56,189,248,0.2)] hover:-translate-y-1 transition-all duration-300"
        >
          <option value="a-z">A-Z</option>
          <option value="z-a">Z-A</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="font-extrabold  p-3 text-white/70 rounded-2xl bg-[#020617] shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_60px_rgba(56,189,248,0.2)] hover:-translate-y-1 transition-all duration-300"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="inaction">Inaction</option>
          <option value="done">Done</option>
        </select>
      </div>

      {filteredData.length === 0 ? (
        <p className="text-slate-400 font-extrabold  text-center mt-10">
          No tasks found
        </p>
      ) : (
        <ul className="flex flex-wrap gap-9">
          {filteredData.map((task) => (
            <li
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="relative cursor-pointer p-6 rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#020617] shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_60px_rgba(56,189,248,0.2)] hover:-translate-y-1 transition-all duration-300 w-[310px] h-[300px] flex flex-col gap-[15px] justify-center"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 font-extrabold  bg-white/5 rounded-xl border border-white/10 text-cyan-400">
                  <HiOutlineClipboardList className="text-2xl" />
                </div>

                <h3 className="text-lg font-semibold text-white ml-4">
                  {task.taskName.length > 10
                    ? task.taskName.slice(0, 10) + "..."
                    : task.taskName}
                </h3>
              </div>

              <div className="flex flex-col gap-4 mb-4">
                <div className="flex gap-3 items-center font-extrabold ">
                  <HiOutlineUser className="text-gray-500 text-lg" />
                  <div>
                    <p className="text-sm text-slate-400">Assigned Employee</p>
                    <p className="text-slate-200 font-medium">
                      {task.employeeName}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-center font-extrabold ">
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
                <button className="text-cyan-400 font-extrabold  font-medium p-[5px] w-[80px] rounded-[10px] bg-[#101827]">
                  {task.status}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0f172a] w-[500px] p-8 rounded-3xl shadow-[0_0_60px_rgba(56,189,248,0.2)] relative">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 text-cyan-400">
              {selectedTask.taskName}
            </h2>

            <div className="space-y-4 text-slate-200">
              <p>
                <span className="text-slate-400">Assigned Employee:</span>{" "}
                {selectedTask.employeeName}
              </p>
              <p>
                <span className="text-slate-400">Deadline:</span>{" "}
                {selectedTask.deadline}
              </p>
              <p>
                <span className="text-slate-400">Status:</span>{" "}
                {selectedTask.status}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTasks;
