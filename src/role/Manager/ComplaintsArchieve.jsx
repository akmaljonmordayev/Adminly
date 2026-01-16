import React, { useEffect, useState } from "react";
import {
  FiClipboard,
  FiUser,
  FiCalendar,
  FiActivity,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";

function ComplaintsArchieve() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/complaintsDeleted")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch(console.error);
  }, []);

  const handleRestore = async (item) => {
    await fetch("http://localhost:5000/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    await fetch(
      `http://localhost:5000/complaintsDeleted/${item.id}`,
      { method: "DELETE" }
    );

    setData((prev) => prev.filter((c) => c.id !== item.id));
  };

  const handleDeleteForever = async (id) => {
    if (!window.confirm("Rostdan ham bu ma'lumotni o'chirmoqchimisiz?")) return;

    await fetch(
      `http://localhost:5000/complaintsDeleted/${id}`,
      { method: "DELETE" }
    );

    setData((prev) => prev.filter((c) => c.id !== id));
  };

  const statusStyles = {
    pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
    reviewed: "bg-blue-400/10 text-blue-400 border-blue-400/30",
    resolved: "bg-green-400/10 text-green-400 border-green-400/30",
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-12 tracking-wide">
        Archived Complaints
      </h1>

      {data.length === 0 && (
        <div className="text-center text-gray-400 mt-32">
          <FiClipboard className="mx-auto text-4xl mb-4 opacity-40" />
          Archive bo‘sh
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="
              group relative rounded-1xl
              bg-[#0b1220]/80 backdrop-blur-xl
              border border-white/10
              p-7
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)]
              hover:border-cyan-400/30
              rounded-4xl
            "
          >
            <div className="flex items-start gap-4 mb-8 ">
              <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center">
                <FiClipboard className="text-cyan-400 text-xl" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Complaint
                </p>
              </div>
            </div>

            <div className="space-y-6 text-xl">
              <div className="flex items-center gap-3">
                <FiUser className="text-gray-400" />
                <span>{item.employeeName}</span>
              </div>

              <div className="flex items-center gap-3">
                <FiCalendar className="text-gray-400" />
                <span>{item.date}</span>
              </div>

              <div className="flex items-center gap-3">
                <FiActivity className="text-gray-400" />
                <span
                  className={`px-3 py-1 rounded-full border text-xs font-medium ${
                    statusStyles[item.status?.toLowerCase()] ||
                    "bg-gray-500/10 text-gray-300 border-gray-500/20"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            <div className="my-8 h-px bg-white/10" />

            <div className="flex gap-3">
              <button
                onClick={() => handleRestore(item)}
                className="
                  flex-1 h-11 rounded-xl
                  bg-cyan-500/10 text-cyan-400
                  hover:bg-cyan-500/20
                  flex items-center justify-center gap-2
                  text-sm font-medium
                  transition
                "
              >
                <FiRefreshCw />
                Restore
              </button>

              <button
                onClick={() => handleDeleteForever(item.id)}
                className="
                  h-11 w-11 rounded-xl
                  bg-red-500/10 text-red-400
                  hover:bg-red-500/20
                  flex items-center justify-center
                  transition
                "
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComplaintsArchieve;
