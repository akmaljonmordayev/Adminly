import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";

const Announcements = () => {
  const API = "http://localhost:5000/announcements";

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
      announcements.map((a) =>
        a.id === editingAnn.id ? updated : a
      )
    );

    setIsModalOpen(false);
    setEditingAnn(null);
  };

  const handleSelectDate = (day) => {
    setDate(`Jan ${day}, 2026`);
    setCalendarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050A18] to-black p-10 text-white">
      <div className="mb-10 rounded-3xl border border-white/10 bg-white/10 p-6">
        <h1 className="mb-4 text-2xl font-bold text-cyan-400">
          📢 New Announcement
        </h1>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="rounded-xl bg-black/30 border border-white/20 px-4 py-3"
          />

          <input
            placeholder="Text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="rounded-xl bg-black/30 border border-white/20 px-4 py-3"
          />

          <button
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="rounded-xl bg-white text-black font-semibold"
          >
            {date || "📅 Select date"}
          </button>

          <button
            onClick={addAnnouncement}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold"
          >
            Add
          </button>
        </div>

        {calendarOpen && (
          <div className="mt-4 rounded-2xl bg-white text-black p-4 w-64">
            <p className="text-center font-bold mb-2">January 2026</p>
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
                  className="rounded hover:bg-cyan-500 hover:text-white"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-xl font-bold">{a.title}</h2>
            <p className="text-gray-400">{a.text}</p>
            <p className="text-sm text-cyan-400 mt-2">{a.date}</p>

            <div className="mt-4 flex gap-3">
              <Button type="primary" onClick={() => openEditModal(a)}>
                Edit
              </Button>

              <button
                onClick={() => deleteAnnouncement(a.id)}
                className="rounded-lg bg-red-500/20 px-4 py-2 text-red-400 hover:bg-red-600 hover:text-white"
              >
                Delete
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
        okText="Save"
      >
        <input
          className="w-full mb-3 border rounded p-2"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          className="w-full mb-3 border rounded p-2"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Text"
        />

        <input
          className="w-full border rounded p-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date"
        />
      </Modal>
    </div>
  );
};

export default Announcements;
