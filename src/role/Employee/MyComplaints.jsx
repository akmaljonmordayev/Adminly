import React, { useEffect, useState } from "react";

function MyComplaints() {
  const worker = JSON.parse(localStorage.getItem("worker"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState([]);



  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://localhost:5000/complaints");
      const data = await res.json();

      // ❗ MUHIM: name emas, employeeName
      const filtered = data.filter(
        (item) => item.employeeName === worker.name
      );

      setComplaints(filtered);
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      employeeName: worker.name, // 🔥 faqat localStorage dan
      date: new Date().toISOString(),
      status: "pending",
    };

    await fetch("http://localhost:5000/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setTitle("");
    setDescription("");
    fetchComplaints();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#020617] to-[#020617] p-8">

      <div className="bg-[#020617]/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 shadow-[0_0_40px_#06b6d433]">
        <form onSubmit={handleSubmit} className="flex gap-4">

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title..."
            required
            className="w-1/4 bg-[#020617] border border-cyan-500/30 rounded-xl px-4 py-3 text-white"
          />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description..."
            required
            className="flex-1 bg-[#020617] border border-purple-500/30 rounded-xl px-4 py-3 text-white"
          />

          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 rounded-xl font-semibold text-white">
            Publish
          </button>

        </form>
      </div>

      <div className="mt-8 space-y-4">
        {complaints.length === 0 && (
          <p className="text-gray-400">Hozircha complaint yo‘q</p>
        )}

        {complaints.map((item) => (
          <div
            key={item.id}
            className="bg-[#020617] border border-cyan-500/20 rounded-xl p-4 text-white"
          >
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-gray-300">{item.description}</p>
            <p className="text-sm text-cyan-400 mt-2">
              Status: {item.status}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default MyComplaints;
