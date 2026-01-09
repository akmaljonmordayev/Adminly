import React, { useEffect, useState } from "react";

const Announcements = () => {
  const API = "http://localhost:5000/announcements";

  const [announcements, setAnnouncements] = useState([]);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setAnnouncements(data));
  }, []);

  const handleSelect = (day) => {
    setDate(`Jan ${day}, 2026`);
    setOpen(false);
  };

  const addAnnouncement = async () => {
    if (!newTitle || !newText) return alert("Fill all fields");

    const newAnn = {
      title: newTitle,
      text: newText,
      date: date || "Jan 1, 2026",
      status: "Active",
    };

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAnn),
    });

    const saved = await res.json();
    setAnnouncements([...announcements, saved]);

    setNewTitle("");
    setNewText("");
    setDate(null);
  };

  const deleteAnnouncement = async (id) => {
    const ok = window.confirm("Are you sure?");
    if (!ok) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050A18] via-[#0B1225] to-black p-10 text-white">

      <div className="mb-10 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">
        <h1 className="mb-4 text-2xl font-bold text-cyan-400">
          📢 New Announcement
        </h1>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="rounded-xl bg-black/30 border border-white/20 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <input
            placeholder="Text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="rounded-xl bg-black/30 border border-white/20 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <button
            onClick={() => setOpen(!open)}
            className="rounded-xl bg-white text-black font-semibold hover:bg-cyan-400 transition"
          >
            {date || "📅 Select date"}
          </button>

          <button
            onClick={addAnnouncement}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:scale-105 transition"
          >
            Add
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute z-50 rounded-2xl bg-white text-black p-4 shadow-xl">
          <p className="mb-3 font-bold text-center">January 2026</p>

          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {days.map((d) => (
              <span key={d} className="text-gray-400">{d}</span>
            ))}

            {[...Array(31)].map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i + 1)}
                className="rounded-lg py-1 hover:bg-cyan-500 hover:text-white transition"
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{a.title}</h2>
                <p className="text-gray-400">{a.text}</p>
                <p className="mt-2 text-sm text-cyan-400">{a.date}</p>
              </div>

              <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                {a.status}
              </span>
            </div>

            <button
              onClick={() => deleteAnnouncement(a.id)}
              className="mt-4 rounded-lg bg-red-500/20 px-4 py-2 text-red-400 hover:bg-red-600 hover:text-white transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
