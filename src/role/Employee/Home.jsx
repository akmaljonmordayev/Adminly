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
  FaArrowRight,
} from "react-icons/fa";
import { HiOutlineCalendar } from "react-icons/hi";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [financeData, setFinanceData] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [loading, setLoading] = useState(true);

  let user = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, annRes, compRes, financeRes, empsRes] = await Promise.all([
        axios.get("http://localhost:5000/tasks"),
        axios.get("http://localhost:5000/announcements"),
        axios.get("http://localhost:5000/complaints"),
        axios.get("http://localhost:5000/employeeFinance"),
        axios.get("http://localhost:5000/employees"),
      ]);

      const currentUserName = user?.name || user?.fullName;

      // Filter by Employee Name AND Selected Year
      const filteredTasks = tasksRes.data?.filter(
        (item) => item.employeeName === currentUserName && item.deadline?.startsWith(selectedYear)
      );
      setTasks(filteredTasks);

      const filteredAnn = annRes.data?.filter(
        (item) => item.date.startsWith(selectedYear)
      );
      setAnnouncements(filteredAnn);

      const filteredComp = compRes.data?.filter(
        (item) => item.employeeName === currentUserName && item.date?.startsWith(selectedYear)
      );
      setComplaints(filteredComp);

      const employee = empsRes.data?.find(e => e.fullName === currentUserName || e.name === currentUserName);
      if (employee) {
        const finance = financeRes.data?.find(f => f.employeeId === employee.id && f.year === parseInt(selectedYear));
        setFinanceData(finance);
      }
    } catch (error) {
      console.error("Home fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  // Calculate Real Progress
  const taskProgress = tasks.length > 0
    ? Math.round((tasks.filter(t => t.status === "done" || t.status === "completed").length / tasks.length) * 100)
    : 0;

  const complaintResolution = complaints.length > 0
    ? Math.round((complaints.filter(c => c.status === "resolved").length / complaints.length) * 100)
    : 0;

  const totalEarnings = financeData?.monthly?.reduce((acc, curr) => acc + (curr.totalSalary || 0), 0) || 0;

  const upcomingTask = tasks
    .filter(t => t.status !== "done" && t.status !== "completed")
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];

  const latestAnn = announcements[announcements.length - 1];

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-400 font-bold animate-pulse tracking-widest uppercase">
      INITIALIZING DASHBOARD...
    </div>
  );

  return (
    <div className="p-10 bg-[#020617] min-h-screen">
      <div className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          Welcome back, <span className="text-cyan-400">{user?.name || user?.fullName}</span>
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

      <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto mb-20">
        {/* Real-time Performance Tracking */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 text-white rounded-[2.5rem] p-10 shadow-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black text-white mb-10 flex items-center gap-3 uppercase tracking-widest italic">
              <FaCalendarAlt className="text-cyan-500" /> {selectedYear} Performance
            </h2>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2 items-end">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Task Completion</span>
                  <span className="font-extrabold text-purple-400">{taskProgress}%</span>
                </div>
                <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full transition-all duration-1000" style={{ width: `${taskProgress}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2 items-end">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Resolution Rate</span>
                  <span className="font-extrabold text-emerald-400">{complaintResolution}%</span>
                </div>
                <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-1000" style={{ width: `${complaintResolution}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2 items-end">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Annual Salary Progress</span>
                  <span className="font-extrabold text-rose-400 italic">Total: {totalEarnings.toLocaleString()} UZS</span>
                </div>
                <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-600 to-rose-400 h-full transition-all duration-1000" style={{ width: `70%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live System Status</span>
            </div>
            <button className="text-[10px] text-cyan-400 font-black uppercase tracking-widest hover:text-white transition">Full Report →</button>
          </div>
        </div>

        {/* Up Next & Latest Announcement */}
        <div className="space-y-8">
          {upcomingTask ? (
            <div className="bg-gradient-to-br from-indigo-600/20 to-cyan-600/10 border border-cyan-500/20 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-500 shadow-xl">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <FaTasks size={120} />
              </div>
              <p className="text-cyan-400 text-[10px] font-black tracking-[.3em] uppercase mb-4">Urgent Action Required</p>
              <h3 className="text-2xl font-black text-white italic tracking-tighter mb-2">{upcomingTask.taskName}</h3>
              <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">
                <HiOutlineCalendar className="text-rose-500" /> Deadline: {upcomingTask.deadline}
              </p>
              <button className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-2.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all">
                Mark as Active
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 text-center py-16">
              <p className="text-slate-500 font-black text-[10px] uppercase tracking-[.4em]">All Tasks Clear</p>
            </div>
          )}

          {latestAnn && (
            <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-8 hover:shadow-2xl transition-all duration-500 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                  <FaBullhorn />
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest italic truncate">{latestAnn.title}</h4>
              </div>
              <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed italic">
                "{latestAnn.text}"
              </p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{latestAnn.date?.split('T')[0]}</span>
                <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest cursor-pointer group-hover:translate-x-1 transition-transform">Read More →</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;