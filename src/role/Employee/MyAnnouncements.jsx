import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaBell, FaTimes, FaCalendarAlt, FaSearch, FaFilter } from "react-icons/fa";

function MyAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/announcements");
        setAnnouncements(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      const isYearMatch = a.date.startsWith(selectedYear);
      const isSearchMatch = a.title?.toLowerCase()?.includes(search.toLowerCase());
      return isYearMatch && isSearchMatch;
    });
  }, [announcements, selectedYear, search]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--bg-primary)] text-cyan-400 font-bold tracking-widest animate-pulse">
        LOADING ANNOUNCEMENTS...
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-10 font-sans">
      <div className="max-w-6xl mx-auto mb-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-5xl font-black text-[var(--text-primary)] italic tracking-tighter mb-4">
              CORP <span className="text-cyan-400">NEWS</span>
            </h1>
            <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-xs opacity-60">
              STAY CONNECTED WITH OUR LATEST UPDATES
            </p>
          </div>

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
        </div>

        <div className="mt-12 flex gap-4 bg-[var(--card-bg)]/40 p-3 rounded-2xl border border-cyan-500/10">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="SEARCH HEADLINES..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--bg-secondary)]/50 border border-slate-700/50 py-4 pl-14 pr-6 rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-500 transition-all font-bold text-xs uppercase tracking-widest"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            onClick={() => setSelected(ann)}
            className="group relative cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-[var(--card-bg)] border border-cyan-500/10 rounded-[2rem] p-8 h-full flex flex-col hover:border-cyan-500/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <FaBell />
                </div>
                <div className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase flex items-center gap-2">
                  <FaCalendarAlt className="text-cyan-500" /> {formatDate(ann.date)}
                </div>
              </div>

              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 line-clamp-2 leading-tight">
                {ann.title}
              </h3>

              <p className="text-[var(--text-secondary)] text-sm line-clamp-3 mb-8 flex-1">
                {ann.text}
              </p>

              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <span className="text-[10px] bg-cyan-500/10 px-3 py-1 rounded-full text-cyan-400 font-black uppercase tracking-widest">
                  {ann.status}
                </span>
                <button className="text-xs font-black text-cyan-400 hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest">
                  READ MORE +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!filteredAnnouncements.length && (
        <div className="max-w-6xl mx-auto py-32 text-center bg-[var(--card-bg)]/20 border border-dashed border-cyan-500/10 rounded-[3rem]">
          <p className="text-[var(--text-secondary)] font-bold uppercase tracking-[0.4em]">NO PRESS RELEASES FOUND FOR {selectedYear}</p>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-[var(--bg-secondary)]/90 backdrop-blur-xl flex items-center justify-center z-50 p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[var(--card-bg)] border border-cyan-500/10 w-full max-w-2xl rounded-[3rem] p-12 relative animate-in zoom-in duration-300 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="absolute top-8 right-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
              <FaTimes size={24} />
            </button>
            <div className="text-cyan-400 text-xs font-black tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
              <FaBell /> PRESS RELEASE
            </div>
            <h2 className="text-3xl font-black text-[var(--text-primary)] mb-8 italic tracking-tighter">
              {selected.title}
            </h2>
            <div className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest mb-10 flex items-center gap-2">
              <FaCalendarAlt className="text-cyan-500" /> PUBLISHED ON {formatDate(selected.date)}
            </div>
            <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium h-[250px] overflow-y-auto no-scrollbar pr-2 mb-10">
              {selected.text}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setSelected(null)} className="px-8 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-[var(--text-primary)] font-black uppercase text-[10px] tracking-widest transition-all">
                CLOSE DOCUMENT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAnnouncements;
