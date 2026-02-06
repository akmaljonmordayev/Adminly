import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  HiOutlineClipboardCheck,
  HiOutlineUser,
  HiOutlineClock,
} from "react-icons/hi";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

    if (employeeName) {
      fetchTasks();
    }
  }, [employeeName]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-gradient-to-br from-[#080c16] to-[#020617] min-h-screen p-10">
      <h2 className="text-3xl font-bold mb-10 text-cyan-300">
        My Tasks <span className="text-cyan-300">({tasks.length})</span>
      </h2>

      {tasks.length === 0 ? (
        <p className="text-cyan-300 text-center mt-20">No tasks assigned</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tasks.map((task) => {
            let statusStyle = "bg-gray-100 text-gray-600 border-gray-200";

            if (task.status?.toLowerCase() === "completed") {
              statusStyle =
                "bg-emerald-100 text-emerald-700 border-emerald-300";
            } else if (task.status?.toLowerCase() === "in progress") {
              statusStyle = "bg-sky-100 text-sky-700 border-sky-300";
            } else if (task.status?.toLowerCase() === "pending") {
              statusStyle = "bg-amber-100 text-amber-700 border-amber-300";
            }

            return (
              <li
                key={task.id}
                className="relative p-6 rounded-3xl
                  bg-gradient-to-br from-[#0f172a] to-[#020617]
                  border border-slate-800
                  shadow-[0_0_40px_rgba(0,0,0,0.6)]
                  hover:shadow-[0_0_60px_rgba(56,189,248,0.2)]
                  hover:-translate-y-1 transition-all duration-300
                  w-[280px] h-[300px]
                  flex flex-col justify-center"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-sky-500/10 text-cyan-300">
                    <HiOutlineClipboardCheck className="text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-cyan-300">
                    {task.taskName}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-cyan-300">
                    <HiOutlineUser className="text-lg" />
                    <span className="font-medium">{task.employeeName}</span>
                  </div>

                  <div className="flex items-center gap-3 text-cyan-300">
                    <HiOutlineClock className="text-lg" />
                    <span>{task.deadline}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <span
                    className={`inline-block px-4 py-1.5 text-sm font-semibold rounded-full border ${statusStyle}`}
                  >
                    {task.status}
                  </span>
                </div>

                
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default MyTasks;
