import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import {
  FiSearch,
  FiPlusCircle,
  FiEdit,
  FiTrash2,
  FiUser,
  FiLayers,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const LOGS_URL = "http://localhost:5000/logs";

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Logs() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('a-z')
  const [statusFilter, setStatusFilter] = useState('all')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const [selectedLog, setSelectedLog] = useState(null)

  /* ================= FETCH WITH AXIOS ================= */
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await axios.get(LOGS_URL)
        setData(data)
      } catch (err) {
        setError('Logs not found')
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  /* ================= FILTER + SORT ================= */
  const filteredAndSortedData = useMemo(() => {
    let result = data.filter((log) => {
      const matchesSearch = log.userName
        ?.toLowerCase()
        .includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ||
        log.action?.toLowerCase().includes(statusFilter)

      return matchesSearch && matchesStatus
    })

    return result.sort((a, b) => {
      const nameA = a.userName?.toLowerCase() || ''
      const nameB = b.userName?.toLowerCase() || ''
      return sortOrder === 'a-z'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [data, search, statusFilter, sortOrder]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAndSortedData.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const actionConfig = {
    create: {
      icon: <FiPlusCircle className="mr-2" />,
      style: "bg-green-500/10 text-green-400 border-green-500/30",
    },
    update: {
      icon: <FiEdit className="mr-2" />,
      style: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    },
    delete: {
      icon: <FiTrash2 className="mr-2" />,
      style: "bg-red-500/10 text-red-400 border-red-500/30",
    },
  };

  return (
    <main className="flex bg-[#0A0F1C] min-h-screen py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto w-full flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8 border-b border-[#2BD3F3]/10 pb-6">
          <div className="p-3 bg-[#2BD3F3]/10 rounded-xl">
            <FiLayers size={28} className="text-[#2BD3F3]" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Audit Logs</h2>
            <p className="text-[#2BD3F3]/50 text-sm">
              Total: {data.length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-3 bg-[#111B34] border border-[#2BD3F3]/20 rounded-xl text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111B34] border border-[#2BD3F3]/20 rounded-xl p-3 text-[#2BD3F3]"
          >
            <option value="all">All actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-[#111B34] border border-[#2BD3F3]/20 rounded-xl p-3 text-[#2BD3F3]"
          >
            <option value="a-z">Name: A–Z</option>
            <option value="z-a">Name: Z–A</option>
          </select>
        </div>

        {/* Logs */}
        <div className="space-y-4 mb-8 min-h-[400px]">
          {loading ? (
            <p className="text-center text-[#2BD3F3]">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-400">{error}</p>
          ) : (
            currentItems.map((log) => {
              const key = log.action?.toLowerCase() || ''
              const config =
                actionConfig[
                  key.includes('create')
                    ? 'create'
                    : key.includes('update')
                    ? 'update'
                    : key.includes('delete')
                    ? 'delete'
                    : ''
                ] || {}

              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="cursor-pointer flex items-center justify-between p-5 bg-[#111B34] border border-[#2BD3F3]/5 rounded-2xl hover:bg-[#16223f] hover:border-[#2BD3F3]/30 transition-all shadow-lg"
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0D1322] flex items-center justify-center">
                      <FiUser className="text-[#2BD3F3]/70" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {log.userName}
                      </h3>
                      <p className="text-gray-500 text-xs">
                        ID: {log.userId || '-'}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center px-4 py-1 rounded-lg border text-xs font-bold uppercase ${config.style}`}
                  >
                    {config.icon}
                    {log.action}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination – TO‘G‘IRLANGAN DIZAYN */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border ${
                currentPage === 1
                  ? 'opacity-30 cursor-not-allowed'
                  : 'border-[#2BD3F3]/30 hover:bg-[#2BD3F3]/10 text-[#2BD3F3]'
              }`}
            >
              <FiChevronLeft />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg border font-medium transition-all ${
                  currentPage === i + 1
                    ? 'bg-[#2BD3F3] text-[#0D1322] border-[#2BD3F3]'
                    : 'border-[#2BD3F3]/20 text-[#2BD3F3] hover:bg-[#2BD3F3]/10'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border ${
                currentPage === totalPages
                  ? 'opacity-30 cursor-not-allowed'
                  : 'border-[#2BD3F3]/30 hover:bg-[#2BD3F3]/10 text-[#2BD3F3]'
              }`}
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111B34] max-w-md w-full rounded-2xl p-6 border border-[#2BD3F3]/20">
            <h3 className="text-xl font-bold text-white mb-4">
              Log details
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">User name</span>
                <span className="text-white">{selectedLog.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">User ID</span>
                <span className="text-white">{selectedLog.userId || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-white">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date</span>
                <span className="text-white">
                  {formatDate(selectedLog.date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Page</span>
                <span className="text-white">{selectedLog.page || '-'}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="mt-6 w-full py-2 rounded-xl bg-[#2BD3F3] text-[#0D1322] font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Logs;
