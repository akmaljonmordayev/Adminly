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
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSelect = (day) => {
    setDate(`Jan ${day}, 2026`);
    setOpen(false);
  };

  const addAnnouncement = async () => {
    if (!newTitle || !newText) {
      alert("Please enter title and text!");
      return;
    }

    const selectedDate = date || `Jan ${new Date().getDate()}, 2026`;

    const newAnn = {
      title: newTitle,
      text: newText,
      date: selectedDate,
      status: "Active",
    };

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnn),
      });

      if (!res.ok) throw new Error("Failed to add announcement");

      const saved = await res.json();
      setAnnouncements((prev) => [...prev, saved]);

      setNewTitle("");
      setNewText("");
      setDate(null);
    } catch (err) {
      console.error(err);
      alert("Error adding announcement. Check console.");
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting announcement. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#0E1628] to-black p-8 text-white">

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <textarea
            placeholder="Title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 rounded-xl border border-white/20 bg-transparent p-3 text-white"
          />

          <textarea
            placeholder="Text..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="flex-1 rounded-xl border border-white/20 bg-transparent p-3 text-white"
          />

          <div
            onClick={() => setOpen(!open)}
            className="w-56 cursor-pointer rounded-xl border border-blue-500 bg-white px-4 py-3 text-gray-600 text-center"
          >
            {date || "Select date"} 📅
          </div>

          <button
            onClick={addAnnouncement}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-white font-semibold hover:opacity-90"
          >
            Add
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-3 w-80 rounded-2xl bg-white p-4 text-black shadow-xl">
          <div className="mb-3 text-center font-semibold">Jan 2026</div>

          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {days.map((d) => (
              <span key={d} className="text-gray-500">{d}</span>
            ))}

            {[...Array(31)].map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i + 1)}
                className="rounded-lg py-1 hover:bg-blue-500 hover:text-white"
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="flex flex-col md:flex-row justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div>
              <h2 className="text-xl font-bold">{a.title}</h2>
              <p className="text-gray-400">{a.text}</p>
              <p className="text-sm text-blue-400">{a.date}</p>
            </div>

            <button
              onClick={() => deleteAnnouncement(a.id)}
              className="mt-3 md:mt-0 h-fit rounded-lg border border-red-500/30 bg-red-600/20 px-4 py-2 text-red-400 hover:bg-red-600 hover:text-white"
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
