import React, { useState } from "react";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "New Feature", text: "Check our new feature!", status: "Active" },
    { id: 2, title: "Server Maintenance", text: "Maintenance at 10 PM", status: "Inactive" },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");

  const addAnnouncement = () => {
    if (newTitle && newText) {
      setAnnouncements([
        ...announcements,
        { id: Date.now(), title: newTitle, text: newText, status: "Active" },
      ]);
      setNewTitle("");
      setNewText("");
    }
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter((ann) => ann.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Announcements</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Title"
          className="border rounded px-3 py-2 flex-1"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Text"
          className="border rounded px-3 py-2 flex-1"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={addAnnouncement}
        >
          Add
        </button>
      </div>

      <div className="grid gap-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white p-4 rounded shadow flex justify-between items-start">
            <div>
              <h2 className="font-semibold text-lg">{ann.title}</h2>
              <p className="text-gray-600">{ann.text}</p>
              <span
                className={`mt-2 inline-block px-2 py-1 text-xs rounded ${
                  ann.status === "Active" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"
                }`}
              >
                {ann.status}
              </span>
            </div>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => deleteAnnouncement(ann.id)}
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

