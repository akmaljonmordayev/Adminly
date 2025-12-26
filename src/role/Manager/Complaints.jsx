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

  const filteredData = data
    .filter(
      (c) =>
        (c.title?.toLowerCase().includes(search.toLowerCase()) ||
          c.description?.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === "all" ||
          (c.status && c.status.toLowerCase() === statusFilter.toLowerCase()))
    );

  const sortedData = [...filteredData].sort((a, b) =>
    sort === "a-z"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    reviewed: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Complaints Admin</h2>

      {err && <p className="text-red-500 mb-2">{err}</p>}
      {loading && <p className="text-gray-500 mb-2">Yuklanmoqda...</p>}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="a-z">A-Z</option>
          <option value="z-a">Z-A</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedData.map((c) => (
          <div
            key={c.id}
            className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <span
                className={`px-2 py-1 text-sm font-medium rounded ${
                  statusColors[c.status?.toLowerCase()] || "bg-gray-100 text-gray-800"
                }`}
              >
                {c.status
                  ? c.status.charAt(0).toUpperCase() + c.status.slice(1)
                  : "Unknown"}
              </span>
            </div>
            <p className="text-gray-700 mb-1">{c.description}</p>
            <p className="text-gray-500 text-sm">
              Employee: {c.employeeName || "N/A"} | Date: {c.date || "N/A"}
            </p>
          </div>
        ))}

        {!loading && sortedData.length === 0 && (
          <p className="text-gray-500">Hech narsa topilmadi</p>
        )}
      </div>
    </div>
  );
}

export default ComplaintsAdmin;
