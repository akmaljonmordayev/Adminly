import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Leaves() {
  const API_BASE = "http://localhost:5000/resignationLeaves";

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("a-z");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
      if (!Array.isArray(res.data)) {
        throw new Error("Data format error");
      }
      setData(res.data);
    } catch (error) {
      setErr(error.message);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredData = data.filter((c) => {
    const name = c.employeeName?.toLowerCase() || "";
    const desc = c.description?.toLowerCase() || "";
    const status = c.status?.toLowerCase() || "";

    return (
      (name.includes(search.toLowerCase()) ||
        desc.includes(search.toLowerCase())) &&
      (statusFilter === "all" || status === statusFilter)
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const nameA = a.employeeName || "";
    const nameB = b.employeeName || "";
    return sort === "a-z"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = sortedData.slice(indexOfFirst, indexOfLast);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/${id}`, { status: newStatus });

      setData((prev) =>
        prev.map((item) =>
          (item.id || item._id) === id ? { ...item, status: newStatus } : item,
        ),
      );

      toast.success("Status updated");
    } catch {
      toast.error("Status update error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete qilishni tasdiqlaysizmi?")) return;

    try {
      await axios.delete(`${API_BASE}/${id}`);
      toast.success("Deleted successfully");
      getData();
    } catch {
      toast.error("Delete error");
    }
  };

  const statusColors = {
    pending: "bg-yellow-400 text-black",
    approved: "bg-green-500 text-white",
    rejected: "bg-red-500 text-white",
  };

  return (
    <main
      className={`min-h-screen py-10 flex justify-center transition ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="w-full max-w-6xl px-4">
        <div className="flex justify-between items-center mb-8">
          <h2
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Leaves Management
          </h2>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-lg border"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 rounded-lg border"
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
            className="px-4 py-2 rounded-lg border"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading && <p className="text-center">Loading...</p>}
        {err && <p className="text-red-500 text-center">{err}</p>}

        <div className="grid md:grid-cols-2 gap-6">
          {currentData.map((c) => {
            const id = c.id || c._id;
            const status = c.status?.toLowerCase() || "pending";

            return (
              <div
                key={id}
                className={`p-6 rounded-2xl shadow-xl transition hover:scale-105 ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                <h3 className="text-xl font-semibold">
                  {c.employeeName || "No name"}
                </h3>

                <p className="mt-2 opacity-80">
                  {c.description || "No description"}
                </p>

                <span
                  className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-medium ${
                    statusColors[status] || "bg-gray-500 text-white"
                  }`}
                >
                  {status}
                </span>

                <div className="flex gap-3 mt-5">
                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(id, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => handleDelete(id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-400 text-black"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {!loading && sortedData.length === 0 && (
          <p className="text-center mt-6 opacity-70">Ma’lumot topilmadi</p>
        )}
      </div>
    </main>
  );
}

export default Leaves;
