import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineCalendar,
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
    <div className="p-6 bg-[#0b1220] min-h-screen text-slate-100">
      <h2 className="text-2xl font-bold mb-8 text-slate-200">
        My Tasks ({tasks.length})
      </h2>

      {tasks.length === 0 ? (
        <p className="text-slate-400 text-center mt-10">No tasks assigned</p>
      ) : (
        <ul className="space-y-6 flex flex-wrap gap-5">
          {tasks.map((task) => {
            let statusClasses = "";
            // switch (task.status.toLowerCase()) {
            //   case "completed":
            //     statusClasses =
            //       "bg-green-500/20 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.35)]";
            //     break;
            //   case "in progress":
            //     statusClasses =
            //       "bg-blue-500/20 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.35)]";
            //     break;
            //   case "pending":
            //     statusClasses =
            //       "bg-orange-500/20 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.35)]";
            //     break;
            //   default:
            //     statusClasses = "bg-slate-500/20 text-slate-400";
            // }

            return (
              <div
                key={task.id}
                className="relative p-6 rounded-3xl
                       bg-gradient-to-br from-[#0f172a] to-[#020617]
                       border border-slate-800
                       shadow-[0_0_40px_rgba(0,0,0,0.6)]
                       hover:shadow-[0_0_60px_rgba(56,189,248,0.2)]
                       hover:-translate-y-1 transition-all duration-300
                       w-[280px]
                       h-[300px]
                       flex flex-col justify-center"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-cyan-400 flex items-center justify-center">
                    <HiOutlineClipboardList className="text-2xl" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white ml-4">
                    {task.taskName}
                  </h3>
                </div>

                <div className=" gap-4 mb-4 flex flex-col">
                  <div className="flex gap-3 items-center text-[15px]"> 
                  <div>
                    <HiOutlineUser className="text-gray-500 text-lg"/>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Assigned Employee</p>
                    <p className="text-slate-200 font-medium">
                      {task.employeeName}
                    </p>
                  </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div>
                      <HiOutlineCalendar className="text-gray-500 text-lg"/>
                    </div>
                    <div>
                    <p className="text-sm text-slate-400">Deadline</p>
                    <p className="text-slate-200 font-medium">
                      {task.deadline}
                    </p>
                  </div>
                  
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-slate-400 mb-1">Current Status</p>
                  <span
                    className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${statusClasses}`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default MyTasks;
