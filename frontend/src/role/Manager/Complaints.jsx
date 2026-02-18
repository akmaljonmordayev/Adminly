import React, { useEffect, useState, useCallback, useMemo } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
// React Icons
import {
  FaSearch,
  FaTrashAlt,
  FaUser,
  FaRegCalendarAlt,
  FaSortAmountDown,
  FaShieldAlt,
} from 'react-icons/fa'
import { HiFilter, HiOutlineBadgeCheck } from 'react-icons/hi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { MdErrorOutline, MdOutlineHistoryEdu } from 'react-icons/md'

const API_URL = 'http://localhost:5000'

function Complaints() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('a-z')
  const [statusFilter, setStatusFilter] = useState('all')
  const [data, setData] = useState([])
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(true)

  const user = useMemo(() => JSON.parse(localStorage.getItem('user')) || {}, [])

  const getData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/complaints`)
      if (!Array.isArray(res.data)) throw new Error('Invalid data format')
      setData(res.data)
    } catch (error) {
      setErr(error.message)
      toast.error('Sync failed!')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_URL}/complaints/${id}`, { status: newStatus })
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      )
      toast.success('Status updated')
      await axios.post(`${API_URL}/logs`, {
        userName: user.name || 'Admin',
        action: 'UPDATE',
        date: new Date().toISOString(),
        page: 'COMPLAINTS',
      })
    } catch {
      toast.error('Update failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Permanent delete and archive?')) return
    try {
      const target = data.find((item) => item.id === id)
      await axios.post(`${API_URL}/complaintsDeleted`, target)
      await axios.delete(`${API_URL}/complaints/${id}`)
      toast.success('Archived successfully')
      setData((prev) => prev.filter((item) => item.id !== id))
      await axios.post(`${API_URL}/logs`, {
        userName: user.name || 'Admin',
        action: 'DELETE',
        date: new Date().toISOString(),
        page: 'COMPLAINTS',
      })
    } catch {
      toast.error('Deletion error')
    }
  }

  const filteredAndSortedData = useMemo(() => {
    let result = data.filter((item) => {
      const matchSearch =
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      const matchStatus =
        statusFilter === 'all' ||
        item.status?.toLowerCase() === statusFilter.toLowerCase()
      return matchSearch && matchStatus
    })
    return result.sort((a, b) => {
      const valA = a.title || ''
      const valB = b.title || ''
      return sort === 'a-z'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA)
    })
  }, [data, search, statusFilter, sort])

  // Status ranglari
  const statusStyles = {
    pending:
      'bg-amber-500/10 text-amber-500 border-amber-500/20 ring-amber-500/10',
    reviewed:
      'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 ring-indigo-500/10',
    resolved:
      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-emerald-500/10',
  }

  return (
    <div className="min-h-screen p-6 md:p-12 bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20 shadow-2xl shadow-blue-500/10">
              <FaShieldAlt className="text-blue-500 text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">
                Safety<span className="text-blue-500">Core</span>
              </h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />{' '}
                Security Protocols
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/40 backdrop-blur-xl p-2 pr-6 rounded-2xl border border-white/5 shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg">
              {user.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:block">
              <h4 className="text-white text-sm font-bold leading-none">
                {user.name || 'Administrator'}
              </h4>
              <span className="text-[10px] text-blue-400/70 uppercase font-black tracking-tighter">
                Auth: Level 4
              </span>
            </div>
          </div>
        </header>

        <ToastContainer theme="dark" hideProgressBar />

        {/* Dynamic Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">
          <div className="md:col-span-6 relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search data logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-900/50 border border-white/5 focus:border-blue-500/40 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-700 text-white shadow-xl"
            />
          </div>

          <div className="md:col-span-3">
            <div className="relative h-full">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full h-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-4 md:py-0 outline-none text-xs font-black uppercase tracking-widest text-slate-400 cursor-pointer appearance-none hover:border-blue-500/30 transition-all"
              >
                <option className="bg-[#0f172a]" value="a-z">
                  Sort: Ascending
                </option>
                <option className="bg-[#0f172a]" value="z-a">
                  Sort: Descending
                </option>
              </select>
              <FaSortAmountDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="relative h-full">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-4 md:py-0 outline-none text-xs font-black uppercase tracking-widest text-slate-400 cursor-pointer appearance-none hover:border-blue-500/30 transition-all"
              >
                <option className="bg-[#0f172a]" value="all">
                  Status: Global
                </option>
                <option className="bg-[#0f172a]" value="pending">
                  Status: Pending
                </option>
                <option className="bg-[#0f172a]" value="reviewed">
                  Status: Reviewed
                </option>
                <option className="bg-[#0f172a]" value="resolved">
                  Status: Resolved
                </option>
              </select>
              <HiFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        {err && (
          <div className="flex items-center gap-4 bg-rose-500/5 border border-rose-500/20 text-rose-400 p-5 rounded-2xl mb-8 animate-pulse">
            <MdErrorOutline size={24} />
            <span className="font-bold text-sm tracking-tight">{err}</span>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 rounded-[2.5rem] border border-white/5">
            <AiOutlineLoading3Quarters
              className="animate-spin text-blue-600 mb-6"
              size={40}
            />
            <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">
              Accessing Database
            </p>
          </div>
        )}

        {/* Complaints Grid */}
        <div className="grid gap-4">
          {filteredAndSortedData.map((item, index) => (
            <div
              key={item.id}
              className="group bg-slate-900/30 border border-white/5 p-6 md:p-8 rounded-[1.5rem] hover:bg-slate-900/60 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both',
              }}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-md border ${
                        statusStyles[item.status?.toLowerCase()] ||
                        'border-slate-800 text-slate-600'
                      }`}
                    >
                      {item.status || 'unknown'}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed max-w-2xl font-medium">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                      <FaUser className="text-blue-500/40" />{' '}
                      {item.employeeName || 'ID_UNKNOWN'}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                      <FaRegCalendarAlt className="text-blue-500/40" />{' '}
                      {item.date || '--/--/--'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 w-full lg:w-48">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-1">
                      Phase
                    </label>
                    <select
                      value={item.status || 'pending'}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-[11px] font-bold text-white focus:border-blue-500 outline-none cursor-pointer transition-all"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500/5 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-300 text-[11px] font-black uppercase tracking-widest"
                  >
                    <FaTrashAlt size={10} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {!loading && filteredAndSortedData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 bg-slate-900/10 rounded-[2.5rem] border-2 border-dashed border-white/5">
              <HiOutlineBadgeCheck size={60} className="text-slate-800 mb-4" />
              <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">
                No active cases found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/5 blur-[100px] rounded-full" />
      </div>
    </div>
  )
}

export default Complaints
