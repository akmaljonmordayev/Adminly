import axios from "axios";
import React, { useEffect, useState } from "react";

function ComplaintsAdmin() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("a-z");
  const [statusFilter, setStatusFilter] = useState("all");
  const [data, setData] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/complaints");
        if (!Array.isArray(res.data)) throw new Error("Ma'lumot array emas");
        setData(res.data);
      } catch (error) {
        setErr(error.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/complaints/${id}`, {
        status: newStatus,
      });

      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      alert("Status o‘zgartirishda xatolik");
    }
  };

  const filteredData = data.filter(
    (c) =>
      (c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" ||
        c.status?.toLowerCase() === statusFilter.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) =>
    sort === "a-z"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-300",
    reviewed: "bg-blue-500/20 text-blue-300",
    resolved: "bg-green-500/20 text-green-300",
  };

  return (
    <div className="min-h-screen p-6 bg-[#0b1220] text-gray-200">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Complaints Admin</h2>

        {err && <p className="text-red-400 mb-2">{err}</p>}
        {loading && <p className="text-gray-400 mb-2">Yuklanmoqda...</p>}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 rounded bg-[#111827] border border-gray-700 focus:outline-none"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-2 rounded bg-[#111827] border border-gray-700"
          >
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded bg-[#111827] border border-gray-700"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div className="space-y-4">
          {sortedData.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-lg bg-[#111827] border border-gray-700"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{c.title}</h3>

                <span
                  className={`px-2 py-1 text-sm rounded ${
                    statusColors[c.status?.toLowerCase()] ||
                    "bg-gray-500/20 text-gray-300"
                  }`}
                >
                  {c.status || "Unknown"}
                </span>
              </div>

              <p className="text-gray-400 mb-2">{c.description}</p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-gray-500">
                  Employee: {c.employeeName || "N/A"} | Date: {c.date || "N/A"}
                </p>
                <select
                  value={c.status || "pending"}
                  onChange={(e) => handleStatusChange(c.id, e.target.value)}
                  className="p-1 rounded bg-[#0b1220] border border-gray-600 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          ))}

          {!loading && sortedData.length === 0 && (
            <p className="text-gray-400">Hech narsa topilmadi</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplaintsAdmin;
