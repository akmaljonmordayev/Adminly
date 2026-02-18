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
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
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
          (item.id || item._id) === id
            ? { ...item, status: newStatus }
            : item
        )
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
    pending:
      "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md",
    approved:
      "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md",
    rejected:
      "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md",
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#020617] flex flex-col items-center py-12">

      <div className="w-full max-w-4xl">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white">
            Manager Leaves
          </h2>
          <div className="w-28 h-1 bg-cyan-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 rounded-xl bg-[#1E293B] text-white border border-[#334155] focus:ring-2 focus:ring-cyan-500 outline-none shadow-lg placeholder-gray-400"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 rounded-xl bg-[#1E293B] text-white border border-[#334155] focus:ring-2 focus:ring-cyan-500 shadow-lg"
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
            className="px-4 py-3 rounded-xl bg-[#1E293B] text-white border border-[#334155] focus:ring-2 focus:ring-cyan-500 shadow-lg"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading && (
          <p className="text-center text-cyan-400 text-lg">
            Loading...
          </p>
        )}

        {err && (
          <p className="text-center text-red-400">
            {err}
          </p>
        )}

        <div className="flex flex-col gap-8">
          {currentData.map((c) => {
            const id = c.id || c._id;
            const status = c.status?.toLowerCase() || "pending";

            return (
              <div
                key={id}
                className="w-full bg-white/5 backdrop-blur-xl text-white rounded-3xl p-8 shadow-2xl border border-white/10 hover:scale-[1.02] transition duration-300"
              >
                <h3 className="text-2xl font-bold">
                  {c.employeeName || "No name"}
                </h3>

                <p className="mt-3 text-gray-300">
                  {c.description || "No description"}
                </p>

                <span
                  className={`inline-block mt-4 px-5 py-1.5 rounded-full text-sm font-semibold ${statusColors[status]}`}
                >
                  {status.toUpperCase()}
                </span>

                <div className="flex gap-3 mt-6">
                  <select
                    value={status}
                    onChange={(e) =>
                      handleStatusChange(id, e.target.value)
                    }
                    className="flex-1 px-4 py-2 rounded-xl bg-[#1E293B] text-white border border-[#334155] focus:ring-2 focus:ring-cyan-500 shadow"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => handleDelete(id)}
                    className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-3">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-5 py-2 rounded-xl font-semibold transition ${
                  currentPage === index + 1
                    ? "bg-cyan-500 text-white"
                    : "bg-[#1E293B] text-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {!loading && sortedData.length === 0 && (
          <p className="text-center mt-8 text-gray-400">
            Ma’lumot topilmadi
          </p>
        )}

      </div>
    </main>
  );
}

export default Leaves;
