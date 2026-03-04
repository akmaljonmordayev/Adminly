import axios from 'axios'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import {
  FiSearch,
  FiTrash2,
  FiFilter,
  FiCalendar,
  FiUser,
  FiChevronDown,
  FiAlertCircle,
  FiZap,
} from 'react-icons/fi'
import 'react-toastify/dist/ReactToastify.css'

const API = 'http://localhost:5000'

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    style: 'text-amber-400 border-amber-400/30 bg-amber-400/5',
  },
  reviewed: {
    label: 'Reviewed',
    style: 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10',
  },
  resolved: {
    label: 'Resolved',
    style: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  },
}

function ComplaintsAdmin() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('a-z')
  const [statusFilter, setStatusFilter] = useState('all')
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' }

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/complaints`)
      if (!Array.isArray(res.data)) throw new Error('Failed to load data')
      setData(res.data)
    } catch (err) {
      setError(err.message)
      toast.error('Connection error!')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API}/complaints/${id}`, {
        status: newStatus,
      })

      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      )

      toast.success(`Updated: ${newStatus}`)

      await axios.post(`${API}/logs`, {
        userName: user.name,
        action: 'UPDATE',
        date: new Date().toISOString(),
        page: 'COMPLAINTS',
      })
    } catch {
      toast.error('Update failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete?')) return

    try {
      const target = data.find((i) => i.id === id)

      await axios.post(`${API}/complaintsDeleted`, target)

      await axios.delete(`${API}/complaints/${id}`)

      setData((prev) => prev.filter((item) => item.id !== id))

      toast.warning('Complaint deleted')

      await axios.post(`${API}/logs`, {
        userName: user.name,
        action: 'DELETE',
        date: new Date().toISOString(),
        page: 'COMPLAINTS',
      })
    } catch {
      toast.error('Delete failed')
    }
  }

  const processedData = useMemo(() => {
    const filtered = data.filter(
      (c) =>
        (c.title?.toLowerCase().includes(search.toLowerCase()) ||
          c.description?.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === 'all' ||
          c.status?.toLowerCase() === statusFilter.toLowerCase()),
    )

    return filtered.sort((a, b) => {
      const titleA = a.title || ''
      const titleB = b.title || ''

      return sort === 'a-z'
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA)
    })
  }, [data, search, statusFilter, sort])

  const getStatusStyle = (status) =>
    STATUS_CONFIG[status?.toLowerCase()]?.style ||
    'text-slate-400 border-slate-700'

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-red-500">
        <div className="text-center">
          <FiAlertCircle className="text-5xl mx-auto mb-4" />
          <p className="text-xl font-bold">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Complaints Management
          </h1>
        </header>

        {/* CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          {/* Search */}
          <div className="md:col-span-6 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/60 border-2 border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyan-400 transition-all text-white"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3 relative">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-900/60 border-2 border-slate-800 rounded-2xl py-4 pl-12 pr-10 appearance-none focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option className='bg-[#]' value="all">All Statuses</option>
              <option className='bg-[#]' value="pending">Pending</option>
              <option className='bg-[#]' value="reviewed">Reviewed</option>
              <option className='bg-[#]' value="resolved">Resolved</option>
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400" />
          </div>

          {/* Sort */}
          <div className="md:col-span-3 relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-slate-900/60 border-2 border-slate-800 rounded-2xl py-4 px-6 appearance-none focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="a-z">Sort: A-Z</option>
              <option value="z-a">Sort: Z-A</option>
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400" />
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-20">
              <FiZap className="text-5xl text-cyan-400 animate-bounce mx-auto mb-4" />
              <p className="text-cyan-400 font-bold uppercase">
                Loading Data...
              </p>
            </div>
          ) : processedData.length > 0 ? (
            processedData.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-cyan-400 transition-all"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`text-xs font-bold uppercase px-4 py-1.5 rounded-full border-2 ${getStatusStyle(
                          item.status,
                        )}`}
                      >
                        {item.status || 'NEW'}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">
                      {item.title}
                    </h3>

                    <p className="text-slate-400 mb-6">{item.description}</p>

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-cyan-400" />
                        <span>{item.employeeName || 'System'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-cyan-400" />
                        <span>{item.date || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-4">
                    <select
                      value={item.status || 'pending'}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                      className={`bg-slate-950 border-2 rounded-xl px-4 py-3 text-xs font-bold uppercase cursor-pointer ${getStatusStyle(
                        item.status,
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                    </select>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-3 p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <FiTrash2 size={20} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-2xl">
              <FiAlertCircle className="text-6xl text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">No complaints found</p>
            </div>
          )}
        </div>
      </div>

      <ToastContainer
        theme="dark"
        toastClassName="!bg-slate-950 !border !border-cyan-400 !text-cyan-400"
        progressClassName="!bg-cyan-400"
      />
    </div>
  )
}

export default ComplaintsAdmin
