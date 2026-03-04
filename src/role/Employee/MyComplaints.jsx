import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaExclamationCircle, FaCheckCircle, FaClock, FaCalendarAlt, FaPlus } from "react-icons/fa";

function MyComplaints() {
  const [allComplaints, setAllComplaints] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/complaints");
        // Filter by user's full name
        const userComplaints = res.data.filter(c => c.employeeName === user?.fullName);
        setAllComplaints(userComplaints);
      } catch (err) {
        console.error("Fetch complaints error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [user?.fullName]);

  const filteredComplaints = useMemo(() => {
    return allComplaints.filter(c => {
      const yearMatch = c.date.startsWith(selectedYear);
      const statusMatch = activeFilter === "all" || c.status.toLowerCase() === activeFilter.toLowerCase();
      return yearMatch && statusMatch;
    });
  }, [allComplaints, selectedYear, activeFilter]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "resolved": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-400 font-bold animate-pulse">LOADING RECORDS...</div>;

  return (
    <div className="min-h-screen bg-[#020617] p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter mb-4">
              MY <span className="text-rose-500">COMPLAINTS</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs opacity-60">
              REPORT ISSUES OR SHARE FEEDBACK
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10">
            {["2025", "2026"].map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${selectedYear === y
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                {y} Year
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800">
          <div className="flex items-center gap-6">
            <div className="bg-slate-950/50 px-8 py-4 rounded-2xl border border-slate-800 text-center">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total {selectedYear}</p>
              <p className="text-2xl font-black text-white">{filteredComplaints.length}</p>
            </div>
            <div className="bg-emerald-500/10 px-8 py-4 rounded-2xl border border-emerald-500/20 text-center">
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-1">Resolved</p>
              <p className="text-2xl font-black text-emerald-400">{filteredComplaints.filter(c => c.status === "resolved").length}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="bg-slate-950/50 border border-slate-700/50 px-6 py-4 rounded-xl text-rose-400 outline-none font-black text-xs uppercase appearance-none cursor-pointer hover:border-rose-500 transition-all"
            >
              <option value="all">ALL STATUS</option>
              <option value="pending">PENDING</option>
              <option value="resolved">RESOLVED</option>
            </select>
            <button className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 px-6 py-4 rounded-xl text-white font-black text-xs uppercase transition-all shadow-lg shadow-rose-500/20">
              <FaPlus /> NEW ISSUE
            </button>
          </div>
        </div>

        <div className="grid gap-6 pb-20">
          {filteredComplaints.map((item) => (
            <div
              key={item.id}
              className="group bg-[#0f172a] border border-slate-800 p-8 rounded-[2rem] hover:border-rose-500/50 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                    <FaExclamationCircle size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight italic">{item.title}</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Ref ID: #{item.id}</p>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                {item.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                    <FaCalendarAlt className="text-rose-500" /> {item.date}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs ring-1 ring-slate-800 px-3 py-1 rounded-lg">
                    <FaClock className="text-amber-500" /> {item.status === "resolved" ? "CLOSED" : "IN REVIEW"}
                  </div>
                </div>
                <button className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                  VIEW LOGS →
                </button>
              </div>
            </div>
          ))}

          {filteredComplaints.length === 0 && (
            <div className="text-center py-32 bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem]">
              <p className="text-slate-500 font-bold uppercase tracking-[0.4em]">NO COMPLAINT MOTIONS FILED FOR {selectedYear}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyComplaints;
