import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaFileSignature, FaTimes, FaCalendarAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import React from "react";
function MyLeaves() {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    department: "",
    position: "",
    reason: "",
    description: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/resignationLeaves");
      const currentUserName = (user?.name || user?.fullName)?.trim()?.toLowerCase() || "";
      const myData = res.data.filter(item => item.employeeName?.trim()?.toLowerCase() === currentUserName);
      setData(myData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.fullName]);

  const filteredLeaves = useMemo(() => {
    return data.filter(item => item.appliedDate?.startsWith(selectedYear));
  }, [data, selectedYear]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    const newItem = {
      ...form,
      employeeName: user?.name || user?.fullName || "Employee",
      appliedDate: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    try {
      const res = await axios.post("http://localhost:5000/resignationLeaves", newItem);
      setData([...data, res.data]);
      setOpen(false);
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  if (loading) return <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-cyan-400 font-bold animate-pulse tracking-widest uppercase">LOADING RECORDS...</div>;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h1 className="text-4xl font-black text-[var(--text-primary)] italic tracking-tighter mb-4">
              MY <span className="text-cyan-400 uppercase">Resignations</span>
            </h1>
            <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-xs opacity-60">
              OFFICIAL LEAVE AND TERMINATION REQUESTS
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-cyan-500/5 p-1 rounded-2xl border border-cyan-500/10">
              {["2025", "2026"].map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${selectedYear === y
                    ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                >
                  {y} Year
                </button>
              ))}
            </div>

            <button
              onClick={() => setOpen(true)}
              className="px-6 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black text-xs uppercase transition-all shadow-lg shadow-cyan-500/20"
            >
              + NEW MOTION
            </button>
          </div>
        </div>

        <div className="grid gap-6 pb-20">
          {filteredLeaves.map((item) => (
            <div key={item.id} className="group relative bg-[var(--card-bg)] border border-cyan-500/10 p-8 rounded-[3rem] hover:border-cyan-500/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <FaFileSignature size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[var(--text-primary)] italic tracking-tighter uppercase">{item.department || "General"} Department</h3>
                    <p className="text-[10px] text-[var(--text-secondary)] font-black tracking-widest uppercase mt-1">Ref ID: #{item.id}</p>
                  </div>
                </div>
                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-[var(--card-bg)]mber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                  {item.status === 'approved' ? <FaCheckCircle /> : <FaExclamationCircle />} {item.status}
                </span>
              </div>

              <div className="mb-10 pl-2">
                <p className="text-slate-200 font-bold mb-2 text-lg italic tracking-tight">{item.position || "Staff Member"}</p>
                <p className="text-[var(--text-secondary)] font-black uppercase text-[10px] tracking-widest mb-4">Reasoning: {item.reason || "N/A"}</p>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-2xl font-medium">{item.description}</p>
              </div>

              <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest">
                  <FaCalendarAlt className="text-cyan-500" /> Filed on {item.appliedDate}
                </div>
              </div>
            </div>
          ))}

          {filteredLeaves.length === 0 && (
            <div className="col-span-full text-center py-32 bg-[var(--card-bg)]/20 border border-dashed border-cyan-500/10 rounded-[3rem]">
              <p className="text-[var(--text-secondary)] font-bold uppercase tracking-[0.4em]">NO PENDING OR PREVIOUS MOTIONS FILED FOR {selectedYear}</p>
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-[var(--bg-secondary)]/90 backdrop-blur-xl flex items-center justify-center z-50 p-6 overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="bg-[var(--card-bg)] border border-cyan-500/10 w-full max-w-2xl rounded-[3rem] p-12 relative shadow-2xl animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute top-8 right-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
              <FaTimes size={24} />
            </button>
            <h2 className="text-4xl font-black text-[var(--text-primary)] mb-4 italic tracking-tighter italic uppercase">New <span className="text-cyan-400">Motion</span></h2>
            <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px] opacity-60 mb-10">SUBMIT OFFICIAL RESIGNATION DOCUMENTATION</p>

            <form onSubmit={submit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">Department</label>
                  <input name="department" placeholder="E.G. ENGINEERING" onChange={handleChange} className="w-full bg-[var(--bg-secondary)]/50 border border-cyan-500/10 p-4 rounded-xl text-[var(--text-primary)] font-bold outline-none focus:border-cyan-500 transition-all text-sm uppercase tracking-widest" required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">Position</label>
                  <input name="position" placeholder="E.G. SENIOR DEV" onChange={handleChange} className="w-full bg-[var(--bg-secondary)]/50 border border-cyan-500/10 p-4 rounded-xl text-[var(--text-primary)] font-bold outline-none focus:border-cyan-500 transition-all text-sm uppercase tracking-widest" required />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">Primary Reason</label>
                <input name="reason" placeholder="E.G. CAREER ADVANCEMENT" onChange={handleChange} className="w-full bg-[var(--bg-secondary)]/50 border border-cyan-500/10 p-4 rounded-xl text-[var(--text-primary)] font-bold outline-none focus:border-cyan-500 transition-all text-sm uppercase tracking-widest" required />
              </div>

              <div>
                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">Detailed Description</label>
                <textarea name="description" placeholder="PROVIDE FULL CONTEXT FOR DISCLOSURE..." onChange={handleChange} className="w-full bg-[var(--bg-secondary)]/50 border border-cyan-500/10 p-4 rounded-xl text-[var(--text-primary)] font-medium outline-none focus:border-cyan-500 transition-all text-sm min-h-[150px] resize-none" required />
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-white/5">
                <button type="button" onClick={() => setOpen(false)} className="text-[var(--text-secondary)] font-black uppercase text-[10px] tracking-widest hover:text-[var(--text-primary)] transition">DISCARD MOTION</button>
                <button className="bg-cyan-500 hover:bg-cyan-600 px-10 py-4 rounded-2xl text-slate-950 font-black text-xs uppercase transition-all shadow-lg shadow-cyan-500/20">FILE DOCUMENTATION</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyLeaves;
