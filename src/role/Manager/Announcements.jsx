import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import {
  HiOutlineClipboardList,
  HiOutlineDocumentText,
  HiOutlineCalendar,
} from "react-icons/hi";

const Announcements = () => {
  const API = "http://localhost:5000/announcements";
  const DELETED_API = "http://localhost:5000/announcementsDeleted";

  const [announcements, setAnnouncements] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [date, setDate] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error(err));
  }, []);

  const addAnnouncement = async () => {
    if (!newTitle || !newText) {
      alert("Fill all fields");
      return;
    }

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
    setDate("");
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    const item = announcements.find((a) => a.id === id);
    if (!item) return;

    await fetch(DELETED_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    await fetch(`${API}/${id}`, { method: "DELETE" });

    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  const openEditModal = (a) => {
    setEditingAnn(a);
    setNewTitle(a.title);
    setNewText(a.text);
    setDate(a.date);
    setIsModalOpen(true);
  };

  const updateAnnouncement = async () => {
    if (!editingAnn) return;

    const updated = {
      ...editingAnn,
      title: newTitle,
      text: newText,
      date,
    };

    await fetch(`${API}/${editingAnn.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    setAnnouncements(
      announcements.map((a) => (a.id === editingAnn.id ? updated : a))
    );

    setIsModalOpen(false);
    setEditingAnn(null);
  };

  const handleSelectDate = (day) => {
    setDate(`Jan ${day}, 2026`);
    setCalendarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#050A18] to-black p-10 text-white">
      <div className="mb-12 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8">
        <h1 className="mb-6 text-3xl font-extrabold text-cyan-400">
          📢 Create Announcement
        </h1>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="rounded-2xl bg-black/40 border border-white/20 px-5 py-4"
          />

          <input
            placeholder="Text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="rounded-2xl bg-black/40 border border-white/20 px-5 py-4"
          />

          <button
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="rounded-2xl bg-white text-black font-bold"
          >
            {date || "📅 Select date"}
          </button>

          <button
            onClick={addAnnouncement}
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold"
          >
            ➕ Add
          </button>
        </div>
      </div>

      {calendarOpen && (
        <div className="mb-12 flex justify-center">
          <div className="rounded-3xl bg-white text-black p-5 w-80">
            <p className="text-center font-bold mb-3">January 2026</p>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {days.map((d) => (
                <span key={d} className="text-gray-400">
                  {d}
                </span>
              ))}
              {[...Array(31)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectDate(i + 1)}
                  className="rounded-xl hover:bg-cyan-500 hover:text-white"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-7"
          >
            <div className="flex items-center gap-3 mb-2">
              <HiOutlineDocumentText className="w-7 h-7 text-cyan-400" />
              <h2 className="text-2xl font-bold">{a.title}</h2>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <HiOutlineClipboardList className="w-6 h-6 text-purple-400" />
              <p className="text-gray-300">{a.text}</p>
            </div>

            <div className="flex items-center gap-3">
              <HiOutlineCalendar className="w-6 h-6 text-blue-400" />
              <p className="text-sm text-cyan-300">{a.date}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => openEditModal(a)}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2"
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => deleteAnnouncement(a.id)}
                className="rounded-xl bg-red-500/20 px-5 py-2 text-red-400 hover:bg-red-600 hover:text-white"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="Edit Announcement"
        open={isModalOpen}
        onOk={updateAnnouncement}
        onCancel={() => setIsModalOpen(false)}
      >
        <input
          className="w-full mb-3 border rounded p-2"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          className="w-full mb-3 border rounded p-2"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <input
          className="w-full border rounded p-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Announcements;
