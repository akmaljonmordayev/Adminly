import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../../components/Card";
import {
  FaTasks,
  FaBullhorn,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
} from "react-icons/fa";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2026");

  let user = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    try {
      const [tasksRes, annRes, compRes] = await Promise.all([
        axios.get("http://localhost:5000/tasks"),
        axios.get("http://localhost:5000/announcements"),
        axios.get("http://localhost:5000/complaints"),
      ]);

      // Filter by Employee Name AND Selected Year
      const filteredTasks = tasksRes.data?.filter(
        (item) => item.employeeName === user.fullName && item.deadline.startsWith(selectedYear)
      );
      setTasks(filteredTasks);

      const filteredAnn = annRes.data?.filter(
        (item) => item.date.startsWith(selectedYear)
      );
      setAnnouncements(filteredAnn);

      const filteredComp = compRes.data?.filter(
        (item) => item.employeeName === user.fullName && item.date.startsWith(selectedYear)
      );
      setComplaints(filteredComp);
    } catch (error) {
      console.error("Home fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  // Mock progress values for demo
  const progressMap = {
    "2025": { profit: 85, tasks: 90, complaints: 100, ann: 95 },
    "2026": { profit: 78, tasks: 65, complaints: 92, ann: 88 },
  };
  const activeProgress = progressMap[selectedYear] || progressMap["2026"];

  return (
    <div className="p-10 bg-[#020617] min-h-screen">
      <div className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          Welcome back, <span className="text-cyan-400">{user.fullName}</span>
        </h1>

        <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10">
          {["2025", "2026"].map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${selectedYear === y
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              {y} Year
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-10 mb-16 max-w-6xl mx-auto overflow-x-auto no-scrollbar py-4">
        <Card title="YOUR TASKS" value={tasks?.length || 0} icon={<FaTasks />} color="purple" />
        <Card title="ANNOUNCEMENTS" value={announcements?.length || 0} icon={<FaBullhorn />} color="blue" />
        <Card title="YOUR COMPLAINTS" value={complaints?.length || 0} icon={<FaExclamationCircle />} color="red" />
      </div>

      <div className="max-w-4xl mx-auto bg-slate-900/40 backdrop-blur-xl border border-slate-800 text-white rounded-[2.5rem] p-12 shadow-2xl">
        <h2 className="text-2xl font-black text-white mb-12 flex items-center gap-3 uppercase tracking-widest italic">
          <FaCalendarAlt className="text-cyan-500" /> {selectedYear} Performance Progress
        </h2>

        <div className="space-y-10">
          <div>
            <div className="flex justify-between mb-3 items-end">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Financial Profitability</span>
              <span className="font-bold text-cyan-400 text-xl">{activeProgress.profit}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full transition-all duration-1000" style={{ width: `${activeProgress.profit}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-3 items-end">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Task Completion</span>
              <span className="font-bold text-purple-400 text-xl">{activeProgress.tasks}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: `${activeProgress.tasks}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-3 items-center">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Complaints Resolution</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-400 text-xl">{activeProgress.complaints}%</span>
                <FaCheckCircle className="text-emerald-500" />
              </div>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${activeProgress.complaints}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-3 items-center">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Announcement Engagement</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-400 text-xl">{activeProgress.ann}%</span>
                <FaTimesCircle className="text-rose-500" />
              </div>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full transition-all duration-1000" style={{ width: `${activeProgress.ann}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;