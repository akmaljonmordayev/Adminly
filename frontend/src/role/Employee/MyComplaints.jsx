import React, { useEffect, useState } from "react";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:5000/complaints";

  const fetchTotal = async () => {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTotal(data.length);
    } catch {
      setError("Totalni olishda xatolik");
    }
  };

  const fetchComplaints = async (status) => {
    try {
      setLoading(true);
      setError(null);

      let url = BASE_URL;

      if (status !== "all") {
        url += `?status=${status}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error();

      const data = await res.json();
      setComplaints(data);
    } catch {
      setError("Complaintlarni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotal();
  }, []);

  useEffect(() => {
    fetchComplaints(activeFilter);
  }, [activeFilter]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "reviewed":
        return "bg-purple-500/20 text-purple-400";
      case "resolved":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-blue-500/20 text-blue-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-cyan-400">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-cyan-400">
          My Complaints
        </h1>

        <button className="bg-cyan-500 hover:bg-cyan-600 transition px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20">
          + New Complaint
        </button>
      </div>

      <div className="flex justify-between items-center mb-10">

        {/* Total */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-md w-64 ring-2 ring-cyan-400">
          <p className="text-gray-400 text-sm">Total</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>

      </div>

      <div className="space-y-4">
        {complaints.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-cyan-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-cyan-400">
                {item.title}
              </h2>

              <span
                className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>

            <p className="text-gray-400 text-sm mb-2">
              ID: {item.id} • {item.category}
            </p>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">
                📅 {item.date}
              </span>
              <span className="text-yellow-400">
                ⚡ {item.priority}
              </span>
            </div>
          </div>
        ))}

        {complaints.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            Complaint topilmadi
          </div>
        )}
      </div>
    </div>
  );
}

export default MyComplaints;
