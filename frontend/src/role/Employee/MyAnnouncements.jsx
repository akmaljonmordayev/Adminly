import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaBell, FaTimes } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";

function MyAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("az");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/announcements");
        setAnnouncements(res.data);
      } catch {
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ESC close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // FILTER + SORT
  const filteredAndSorted = useMemo(() => {
    const filtered = announcements.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered];

    switch (sortOrder) {
      case "az":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      default:
        break;
    }

    return sorted;
  }, [announcements, search, sortOrder]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 text-lg animate-pulse bg-[#0b0f19]">
        Yuklanmoqda...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 bg-[#0b0f19]">
        {error}
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-[#0b0f19] relative overflow-hidden p-8">

        {/* Background Glow */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full" />

        {/* Header */}
        <div className="max-w-5xl mx-auto mb-12 relative z-10">
          <h1 className="text-4xl font-bold text-white tracking-wide">
            Announcements
          </h1>
          <p className="text-gray-400 mt-3">
            Eng so‘nggi e’lonlar va yangiliklar
          </p>
        </div>

        {/* Search + Sort */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 mb-16 relative z-10">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              flex-1 px-6 py-4 rounded-2xl
              bg-white/5 backdrop-blur-xl
              text-white placeholder-gray-400
              border border-white/10
              focus:ring-2 focus:ring-blue-500
              focus:outline-none
              transition-all duration-300
            "
          />

          {/* SORT */}
          <div className="relative md:w-60">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="
                w-full px-6 py-4 rounded-2xl
                bg-white/5 backdrop-blur-xl
                text-[blue]
                border border-white/10
                focus:ring-2 focus:ring-purple-500
                focus:outline-none
                transition-all duration-300
                appearance-none cursor-pointer
              "
            >
              <option value="az">A - Z</option>
              <option value="za">Z - A</option>
              <option value="newest">Eng yangi</option>
              <option value="oldest">Eng eski</option>
            </select>

            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              ▼
            </div>
          </div>

        </div>

        {/* Cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 relative z-10">
          {filteredAndSorted.map((announcement) => (
            <div
              key={announcement.id}
              onClick={() => setSelected(announcement)}
              className="
              group cursor-pointer
              rounded-3xl p-[1px]
              bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-pink-500/40
              hover:from-blue-500 hover:via-purple-500 hover:to-pink-500
              transition-all duration-500
              "
            >
              <div
                className="
                rounded-3xl p-8
                bg-[#111827]/90 backdrop-blur-xl
                border border-white/10
                shadow-[0_30px_80px_rgba(0,0,0,0.7)]
                group-hover:shadow-[0_40px_100px_rgba(139,92,246,0.5)]
                group-hover:-translate-y-3
                transition-all duration-500
                "
              >
                <FaBell className="text-blue-400 text-3xl mb-5 group-hover:scale-110 transition" />

                <h3 className="text-white text-xl font-semibold mb-3">
                  {announcement.title}
                </h3>

                <p className="text-gray-400 line-clamp-2 mb-5">
                  {announcement.text}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MdDateRange />
                  {formatDate(announcement.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[95%] md:w-[750px] max-h-[85vh] overflow-y-auto rounded-3xl p-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          >
            <div className="bg-[#0f172a] rounded-3xl p-10 shadow-[0_40px_120px_rgba(0,0,0,0.9)]">

              <button
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-300"
              >
                <FaTimes size={18} />
              </button>

              <h2 className="text-white text-3xl font-bold mb-6">
                {selected.title}
              </h2>

              <p className="text-gray-300 leading-relaxed whitespace-pre-line mb-8 text-lg">
                {selected.text}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MdDateRange />
                {formatDate(selected.date)}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyAnnouncements;
