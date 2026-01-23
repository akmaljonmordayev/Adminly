import axios from "axios";
import React, { useEffect, useState } from "react";

function Leaves() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("a-z");
  const [statusFilter, setStatusFilter] = useState("all");
  const [data, setData] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/resignations");
        if (!Array.isArray(res.data))
          throw new Error("Ma'lumot formati noto‘g‘ri");
        setData(res.data);
      } catch (error) {
        setErr(error.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const filteredData = data.filter(
    (c) =>
      (c.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" ||
        c.status?.toLowerCase() === statusFilter.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) =>
    sort === "a-z"
      ? (a.employeeName || "").localeCompare(b.employeeName || "")
      : (b.employeeName || "").localeCompare(a.employeeName || "")
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = async (id, newStatus) => {
    const user = JSON.parse(localStorage.getItem("user")) || {};

    try {
      await axios.patch(`http://localhost:5000/resignations/${id}`, {
        status: newStatus,
      });

      await axios.post("http://localhost:5000/logs", {
        userName: user.name || "Unknown",
        action: `Leave status changed to ${newStatus}`,
        date: Date.now(),
      });

      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch {
      alert("Status o‘zgartirishda xatolik yuz berdi");
    }
  };

  const statusColors = {
    pending: "bg-yellow-500 text-white",
    approved: "bg-blue-500 text-white",
    rejected: "bg-red-500 text-white",
  };

  return (
    <main className="flex bg-[#020617]">
      <div className="p-6 max-w-5xl mx-auto min-h-screen bg-[#020617] text-cyan-300">
        <h2 className="text-2xl font-bold mb-4 text-white">Leaves</h2>

        {err && <p className="text-red-400 mb-2">{err}</p>}
        {loading && <p className="text-cyan-400 mb-2">Yuklanmoqda...</p>}

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 bg-[#020617] border border-cyan-700 rounded-md text-white placeholder-cyan-400 focus:ring-2 focus:ring-cyan-500"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-2 bg-[#020617] border border-cyan-700 rounded-md text-white"
          >
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 bg-[#020617] border border-cyan-700 rounded-md text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="space-y-4">
          {currentData.map((c) => (
            <div
              key={c.id}
              className="w-[800px] p-4 bg-[#020617] border border-cyan-800 rounded-lg shadow-sm hover:shadow-cyan-500/100 transition flex justify-between items-center"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {c.employeeName || "No name"}
                </h3>
                <span
                  className={`px-2 py-1  text-sm font-medium rounded w-[230px] ${
                    statusColors[c.text?.toLowerCase()] ||
                    "bg-cyan-900 text-white"
                  }`}
                >
                  {c.comment
                    ? c.comment.charAt(0).toUpperCase() + c.comment.slice(1)
                    : "Unknown"}
                </span>
                <p className="text-cyan-400 text-sm">
                  Position: {c.position || "N/A"} | Date:{" "}
                  {c.noticePeriod || "N/A"}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    statusColors[c.status?.toLowerCase()] ||
                    "bg-gray-600 text-white"
                  }`}
                >
                  {c.status || "Unknown"}
                </span>

                <select
                  value={c.status || "pending"}
                  onChange={(e) => handleStatusChange(c.id, e.target.value)}
                  className="p-1 rounded bg-[#0b1220] border border-gray-600 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border border-cyan-600 rounded ${
                  currentPage === i + 1
                    ? "bg-cyan-600 text-black"
                    : "text-cyan-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Leaves;
