import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  HiOutlineClipboardList,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineStatusOnline,
  HiOutlineRefresh,
  HiOutlineTrash,
} from "react-icons/hi";

function AnnouncementsArchieve() {
  const [data, setData] = useState([]);
  const [err, setErr] = useState("");

  const getData = async () => {
    try {
      let res = await axios.get("http://localhost:5000/announcementsDeleted");
      setData(res.data);
    } catch (error) {
      setErr(error.message);
    }
  };
  getData();

  useEffect(() => {
    getData();
  }, []);

  const deleteAnnouncements = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/announcementsDeleted/${id}`);
      toast.error("Announcment permanently deleted");
      getData();
    } catch {
      toast.error("Delete failed");
    }
  };

  const restoreAnnouncements = async (announcement) => {
    try {
      await axios.post("http://localhost:5000/announcements", announcement);
      await axios.delete(`http://localhost:5000/announcementsDeleted/${announcement.id}`);
      toast.error("Announcment permanently deleted");
      getData();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Archived Announcements
        </h2>

        <div className="bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full">
          <span className="text-cyan-400 font-mono text-sm font-bold">
            {data.length}
          </span>
        </div>
      </div>

      {err && <p className="text-red-500 mb-6">{err}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((delTask) => (
          <div
            key={delTask.id}
            className="relative bg-[#0b1220] border border-white/10 rounded-[30px] p-6 shadow-2xl overflow-hidden"
          >
            {/* soft glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />

            <div className="space-y-4">
              {/* HEADER */}
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-white/5 rounded-xl border border-white/10 text-cyan-400">
                  <HiOutlineClipboardList className="text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {delTask.title}
                  </h3>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1 font-bold">
                    Announcement Name
                  </p>
                </div>
              </div>

              {/* CONTENT */}
              <div className="space-y-3 pt-2">
                {/* TEXT */}
                <div className="flex items-start gap-3 text-gray-300">
                  <HiOutlineDocumentText className="text-gray-500 text-lg mt-1" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-relaxed break-words line-clamp-3">
                      {delTask.text}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase">
                      Text
                    </span>
                  </div>
                </div>

                {/* DATE */}
                <div className="flex items-center gap-3 text-gray-300">
                  <HiOutlineCalendar className="text-gray-500 text-lg" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{delTask.date}</span>
                    <span className="text-[10px] text-gray-500 uppercase">
                      Deadline Date
                    </span>
                  </div>
                </div>

                {/* STATUS */}
                <div className="flex items-center gap-3 text-gray-300">
                  <HiOutlineStatusOnline className="text-gray-500 text-lg" />
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-bold ${
                        delTask.status === "Active"
                          ? "text-green-400"
                          : delTask.status === "Pending"
                          ? "text-orange-400"
                          : "text-gray-400"
                      }`}
                    >
                      {delTask.status}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase">
                      Current Status
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-6 border-t border-white/5 mt-4">
                <button onClick={() => restoreAnnouncements(delTask)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 rounded-2xl border border-white/5 font-bold text-xs uppercase tracking-widest">
                  <HiOutlineRefresh className="text-lg" />
                  Restore
                </button>

                <button
                  onClick={() => deleteAnnouncements(delTask.id)}
                  className="p-3 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-2xl border border-white/5"
                >
                  <HiOutlineTrash className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}

export default AnnouncementsArchieve;
