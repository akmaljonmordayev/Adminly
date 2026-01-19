import React, { useEffect, useState, useMemo } from 'react'
import {
  FiSearch,
  FiPlusCircle,
  FiEdit,
  FiTrash2,
  FiUser,
  FiLayers,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'

const LOGS_URL = 'http://localhost:5000/logs'

function Logs() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('a-z')
  const [statusFilter, setStatusFilter] = useState('all')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6 // Items per page

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(LOGS_URL)
        if (!res.ok) throw new Error('Data not found')
        const result = await res.json()
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  // 1. Filtering and Sorting (before pagination)
  const filteredAndSortedData = useMemo(() => {
    let result = data.filter((log) => {
      const matchesSearch = log.userName
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' || log.action.toLowerCase() === statusFilter
      return matchesSearch && matchesStatus
    })

    return result.sort((a, b) => {
      const nameA = a.userName.toLowerCase()
      const nameB = b.userName.toLowerCase()
      return sortOrder === 'a-z'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA)
    })
  }, [data, search, statusFilter, sortOrder])

  // 2. Pagination logic
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAndSortedData.slice(
    indexOfFirstItem,
    indexOfLastItem,
  )

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter])

  const actionConfig = {
    create: {
      icon: <FiPlusCircle className="mr-2" />,
      style: 'bg-green-500/10 text-green-400 border-green-500/30',
    },
    update: {
      icon: <FiEdit className="mr-2" />,
      style: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    },
    delete: {
      icon: <FiTrash2 className="mr-2" />,
      style: 'bg-red-500/10 text-red-400 border-red-500/30',
    },
  }

  return (
    <main className="flex bg-[#0A0F1C] min-h-screen py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 border-b border-[#2BD3F3]/10 pb-6">
          <div className="p-3 bg-[#2BD3F3]/10 rounded-xl">
            <FiLayers size={28} className="text-[#2BD3F3]" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Audit Logs
            </h2>
            <p className="text-[#2BD3F3]/50 text-sm">Total: {data.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="relative group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#2BD3F3] transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#111B34] border border-[#2BD3F3]/20 rounded-xl text-white outline-none focus:border-[#2BD3F3]/50 transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111B34] border border-[#2BD3F3]/20 rounded-xl p-3 text-[#2BD3F3] outline-none hover:border-[#2BD3F3]/50 transition-colors cursor-pointer"
          >
            <option value="all">All actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-[#111B34] border border-[#2BD3F3]/20 rounded-xl p-3 text-[#2BD3F3] outline-none hover:border-[#2BD3F3]/50 transition-colors cursor-pointer"
          >
            <option value="a-z">Name: A–Z</option>
            <option value="z-a">Name: Z–A</option>
          </select>
        </div>

        {/* Logs list */}
        <div className="space-y-4 mb-8 min-h-[400px]">
          {loading ? (
            <div className="text-center py-10 text-[#2BD3F3]">Loading...</div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-center">
              {error}
            </div>
          ) : (
            currentItems.map((log) => {
              const config = actionConfig[log.action.toLowerCase()] || {
                icon: null,
                style: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
              }
              return (
                <div
                  key={log.id}
                  className="group flex items-center justify-between p-5 bg-[#111B34] border border-[#2BD3F3]/5 rounded-2xl hover:bg-[#16223f] hover:border-[#2BD3F3]/30 transition-all duration-300 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0D1322] flex items-center justify-center border border-[#2BD3F3]/10">
                      <FiUser size={18} className="text-[#2BD3F3]/70" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {log.userName}
                      </h3>
                      <p className="text-gray-500 text-xs">ID: {log.userId}</p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center px-4 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider ${config.style}`}
                  >
                    {config.icon} {log.action}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-auto">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border border-[#2BD3F3]/20 transition-all ${
                currentPage === 1
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-[#2BD3F3]/10 text-[#2BD3F3]'
              }`}
            >
              <FiChevronLeft size={24} />
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-lg border transition-all font-medium ${
                    currentPage === index + 1
                      ? 'bg-[#2BD3F3] border-[#2BD3F3] text-[#0D1322]'
                      : 'border-[#2BD3F3]/20 text-[#2BD3F3] hover:bg-[#2BD3F3]/10'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border border-[#2BD3F3]/20 transition-all ${
                currentPage === totalPages
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-[#2BD3F3]/10 text-[#2BD3F3]'
              }`}
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default Logs
