import React, { useState } from "react";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "New Feature",
      text: "Check our new feature!",
      status: "Active",
    },
    {
      id: 2,
      title: "Server Maintenance",
      text: "Maintenance at 10 PM",
      status: "Inactive",
    },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");

  const addAnnouncement = () => {
    if (!newTitle.trim() || !newText.trim()) return;

    setAnnouncements((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newTitle,
        text: newText,
        status: "Active",
      },
    ]);

    setNewTitle("");
    setNewText("");
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#0E1628] to-black px-8 py-6 text-white">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Announcements
        </h1>
        <span className="text-sm text-gray-400">Dashboard</span>
      </div>

      <div className="mb-10 flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-xl">
        <textarea
          placeholder="Announcement title..."
          className="flex-1 resize-none rounded-xl border border-white/20 bg-transparent px-4 py-3
                     text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none
                     focus:ring-2 focus:ring-blue-500/30"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />

        <textarea
          placeholder="Announcement text..."
          className="flex-1 resize-none rounded-xl border border-white/20 bg-transparent px-4 py-3
                     text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none
                     focus:ring-2 focus:ring-blue-500/30"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />

        <button
          onClick={addAnnouncement}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3
                     font-semibold shadow-lg shadow-blue-500/30 transition
                     hover:scale-105 hover:from-blue-500 hover:to-cyan-400"
        >
          Add
        </button>
      </div>

      <div className="grid gap-6">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="group relative rounded-2xl border border-white/10 bg-white/5 p-6
                       backdrop-blur-lg shadow-lg transition hover:border-blue-500/40"
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0
                            transition group-hover:opacity-100
                            bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
            />

            <div className="relative flex justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">{ann.title}</h2>
                <p className="mt-2 max-w-xl text-gray-400">{ann.text}</p>

                <span
                  className={`mt-4 inline-block rounded-full border px-4 py-1.5 text-xs font-semibold
                    ${
                      ann.status === "Active"
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : "border-gray-500/30 bg-gray-500/10 text-gray-400"
                    }`}
                >
                  {ann.status}
                </span>
              </div>

              <button
                onClick={() => deleteAnnouncement(ann.id)}
                className="h-fit rounded-lg border border-red-500/30 bg-red-600/20
                           px-4 py-2 text-sm font-semibold text-red-400
                           transition hover:bg-red-600 hover:text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
