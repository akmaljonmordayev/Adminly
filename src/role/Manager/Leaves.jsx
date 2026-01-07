import axios from "axios";
import React, { useEffect, useState } from "react";

function Leaves() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("a-z");
  const [statusFilter, setStatusFilter] = useState("all");
  const [data, setData] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/announcements");
        if (!Array.isArray(res.data)) throw new Error("Xatolik!");
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
    pending: "bg-yellow-500 text-white",
    reviewed: "bg-blue-500 text-white",
    resolved: "bg-green-500 text-white",
  };

  return (
    <main className="flex bg-[#020617]">
      <div className="p-6 max-w mx-auto min-h-screen bg-[#020617] text-cyan-300">
      <h2 className="text-2xl font-bold mb-4 text-white">
         Leavesbox
      </h2>

      {err && <p className="text-red-400 mb-2">{err}</p>}
      {loading && <p className="text-cyan-400 mb-2">Yuklanmoqda...</p>}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[600px] flex-1 p-2 bg-[#020617] border border-cyan-700 rounded-md text-white placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 bg-[#020617] border border-cyan-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="a-z">A-Z</option>
          <option value="z-a">Z-A</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 bg-[#020617] border border-cyan-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
            className="w-[800px] p-4 bg-[#020617] border border-cyan-800 rounded-lg shadow-sm hover:shadow-cyan-500/20 transition flex flex-col"
          >
            <div className="flex justify-between items-start mb-2 flex-col sm:flex-col gap-2">
              <h3 className="text-lg font-semibold text-white">
                {c.title}
              </h3>
              <span
                className={`px-2 py-1 text-sm font-medium rounded ${
                  statusColors[c.text?.toLowerCase()] || "bg-cyan-900 text-white"
                }`}
              >
                {c.text
                  ? c.text.charAt(0).toUpperCase() + c.text.slice(1)
                  : "Unknown"}
              </span>
            </div>

            <p className="text-cyan-300 mb-1"></p>

            <p className="text-cyan-400 text-sm">
              Employee: {c.author || "N/A"} | Date: {c.date || "N/A"}
            </p>
          </div>
        ))}

        {!loading && sortedData.length === 0 && (
          <p className="text-cyan-400">Hech narsa topilmadi</p>
        )}
      </div>
    </div>
    </main>
  );
}

export default Leaves;
