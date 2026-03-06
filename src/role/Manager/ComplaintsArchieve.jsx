import { useTheme } from '../../context/ThemeContext';
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FiClipboard,
  FiUser,
  FiCalendar,
  FiActivity,
  FiRefreshCw,
  FiTrash2,
  FiAlertCircle,
  FiMessageSquare
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";

function ComplaintsArchieve() {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    try {
      let res = await axios.get("http://localhost:5000/complaintsDeleted");
      setData(res.data);
    } catch (err) {
      toast.error("Failed to fetch archive");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleRestore = async (item) => {
    try {
      await axios.post("http://localhost:5000/complaints", { ...item });
      await axios.delete(`http://localhost:5000/complaintsDeleted/${item.id}`);
      toast.success("Complaint successfully restored");
      getData();
    } catch (err) {
      toast.error("Restore failed");
    }
  };

  const handleDeleteForever = async (id) => {
    if (!window.confirm("Delete this complaint permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/complaintsDeleted/${id}`);
      toast.error("Permanently deleted");
      getData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const statusStyles = {
    pending: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    reviewed: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    resolved: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-2 border-red-500/10 border-t-red-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-red-500/60 animate-pulse">Syncing History...</p>
    </div>
  )

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight uppercase">Complaints <span className="text-red-400 italic">History</span></h2>
          <p className="text-[var(--text-secondary)] text-xs font-medium mt-1">Found {data.length} archived reports</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-red-500/5">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-400 font-black text-xs uppercase tracking-widest">{data.length} Archived</span>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
          <div className="w-20 h-20 mx-auto mb-6 rounded-[2rem] bg-red-500/5 flex items-center justify-center text-red-400/30 border border-red-500/10">
            <FiMessageSquare size={48} />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Archive is Empty</h3>
          <p className="text-[var(--text-secondary)] text-xs mt-2 uppercase tracking-widest font-black opacity-40">No deleted complaint records found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, i) => (
            <div
              key={item.id}
              className="group relative glass-strong rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-red-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1 animate-fadeInScale"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-br from-red-600/10 to-transparent group-hover:from-red-600/20 transition-all duration-500" />

              <div className="p-7 relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                    <FiMessageSquare size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestore(item)}
                      className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                    >
                      <FiRefreshCw size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteForever(item.id)}
                      className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-black text-[var(--text-primary)] group-hover:text-red-400 transition-colors uppercase leading-tight">{item.title}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400"><FiUser size={18} /></div>
                      <div>
                        <p className="text-[9px] font-black text-red-500 uppercase tracking-widest leading-none mb-1">Reporter</p>
                        <p className="text-xs font-bold text-[var(--text-primary)]">{item.employeeName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400"><FiCalendar size={18} /></div>
                      <div>
                        <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest leading-none mb-1">Date Logged</p>
                        <p className="text-xs font-bold text-[var(--text-primary)]">{item.date}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusStyles[item.status?.toLowerCase()] || "bg-white/5 text-[var(--text-secondary)] border-white/10"}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-secondary)] opacity-50 uppercase tracking-tighter">
                    <FiAlertCircle /> Archived
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer
        theme={isDarkMode ? 'dark' : 'light'}
        position="bottom-right"
        autoClose={2500}
        toastClassName="!rounded-2xl !bg-[var(--bg-secondary)] !border !border-white/5 !shadow-2xl"
      />
    </div>
  );
}

export default ComplaintsArchieve;
