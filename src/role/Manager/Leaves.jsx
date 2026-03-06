import axios from 'axios'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTheme } from '../../context/ThemeContext'
import {
  FiSearch, FiTrash2, FiCalendar, FiChevronDown, FiAlertCircle,
  FiFileText, FiClock, FiCheckCircle, FiXCircle,
} from 'react-icons/fi'

const API_BASE = 'http://localhost:5000/resignationLeaves'

const STATUS_CONFIG = {
  pending: { dot: 'bg-[var(--bg-secondary)]mber-400 shadow-amber-400/50', badge: 'text-amber-300 border-amber-400/20 bg-gradient-to-r from-amber-500/10 to-amber-600/5', cardBorder: 'border-l-amber-500/60' },
  approved: { dot: 'bg-emerald-400 shadow-emerald-400/50', badge: 'text-emerald-300 border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5', cardBorder: 'border-l-emerald-500/60' },
  rejected: { dot: 'bg-red-400 shadow-red-400/50', badge: 'text-red-300 border-red-400/20 bg-gradient-to-r from-red-500/10 to-red-600/5', cardBorder: 'border-l-red-500/60' },
}

function Leaves() {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const { isDarkMode } = useTheme()
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' }

  const getData = useCallback(async () => {
    setLoading(true)
    try { const res = await axios.get(API_BASE); setData(res.data) }
    catch (error) { setErr(error.message); toast.error('Server error') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { getData() }, [getData])

  const availableYears = useMemo(() => [...new Set(data.map((c) => c.appliedDate?.substring(0, 4)).filter(Boolean))].sort((a, b) => b.localeCompare(a)), [data])

  const processedData = useMemo(() => {
    let filtered = data.filter((c) => {
      const s = c.employeeName?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase())
      const st = statusFilter === 'all' || c.status?.toLowerCase() === statusFilter
      const y = selectedYear === 'all' || c.appliedDate?.startsWith(selectedYear)
      return s && st && y
    })
    return filtered.sort((a, b) => {
      if (sort === 'newest') return (b.appliedDate || '').localeCompare(a.appliedDate || '')
      if (sort === 'oldest') return (a.appliedDate || '').localeCompare(b.appliedDate || '')
      if (sort === 'a-z') return (a.employeeName || '').localeCompare(b.employeeName || '')
      return (b.employeeName || '').localeCompare(a.employeeName || '')
    })
  }, [data, search, statusFilter, selectedYear, sort])

  const totalPages = Math.ceil(processedData.length / itemsPerPage)
  const currentData = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const statusCounts = useMemo(() => {
    const yf = selectedYear === 'all' ? data : data.filter((c) => c.appliedDate?.startsWith(selectedYear))
    return { all: yf.length, pending: yf.filter((c) => c.status?.toLowerCase() === 'pending').length, approved: yf.filter((c) => c.status?.toLowerCase() === 'approved').length, rejected: yf.filter((c) => c.status?.toLowerCase() === 'rejected').length }
  }, [data, selectedYear])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/${id}`, { status: newStatus })
      setData((prev) => prev.map((item) => (item.id || item._id) === id ? { ...item, status: newStatus } : item))
      toast.success('Status updated')
      await axios.post('http://localhost:5000/logs', { userName: user.name, action: 'UPDATE', date: new Date().toISOString(), page: 'LEAVES' })
    } catch { toast.error('Update error') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this leave request?')) return
    try {
      await axios.delete(`${API_BASE}/${id}`)
      setData((prev) => prev.filter((item) => (item.id || item._id) !== id))
      toast.success('Deleted')
      await axios.post('http://localhost:5000/logs', { userName: user.name, action: 'DELETE', date: new Date().toISOString(), page: 'LEAVES' })
    } catch { toast.error('Delete error') }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[40%] h-[40%] bg-purple-900/8 blur-[150px] rounded-full animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/8 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-[1500px] mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 animate-fadeInUp">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">RESIGNATION</span>
              <span className="text-[var(--text-primary)]/90 ml-2">&</span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent ml-2">LEAVES</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-xs font-medium mt-1.5 tracking-wider uppercase">Manage leave & resignation requests</p>
          </div>
          <div className="flex items-center gap-2 glass rounded-2xl p-1.5">
            <button onClick={() => { setSelectedYear('all'); setCurrentPage(1) }} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${selectedYear === 'all' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-[var(--text-primary)] shadow-lg shadow-cyan-500/25' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-cyan-500/5'}`}>All</button>
            {availableYears.map((y) => (
              <button key={y} onClick={() => { setSelectedYear(y); setCurrentPage(1) }} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${selectedYear === y ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-[var(--text-primary)] shadow-lg shadow-cyan-500/25' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-cyan-500/5'}`}>{y}</button>
            ))}
          </div>
        </header>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fadeInUp stagger-1 opacity-0">
          {[
            { key: 'all', label: 'Total', icon: <FiFileText />, gradient: 'from-cyan-500/15 to-blue-500/5', iconColor: 'text-cyan-400', borderColor: 'border-cyan-500/20 hover:border-cyan-400/40' },
            { key: 'pending', label: 'Pending', icon: <FiClock />, gradient: 'from-amber-500/15 to-orange-500/5', iconColor: 'text-amber-400', borderColor: 'border-amber-500/20 hover:border-amber-400/40' },
            { key: 'approved', label: 'Approved', icon: <FiCheckCircle />, gradient: 'from-emerald-500/15 to-green-500/5', iconColor: 'text-emerald-400', borderColor: 'border-emerald-500/20 hover:border-emerald-400/40' },
            { key: 'rejected', label: 'Rejected', icon: <FiXCircle />, gradient: 'from-red-500/15 to-rose-500/5', iconColor: 'text-red-400', borderColor: 'border-red-500/20 hover:border-red-400/40' },
          ].map((s) => (
            <button key={s.key} onClick={() => { setStatusFilter(s.key); setCurrentPage(1) }}
              className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-500 text-left group cursor-pointer ${s.borderColor} ${statusFilter === s.key ? 'ring-1 ring-white/10 bg-[var(--bg-secondary)]' : 'bg-[var(--bg-secondary)]'}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="noise absolute inset-0 rounded-2xl" />
              <div className="relative flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-cyan-500/5 flex items-center justify-center ${s.iconColor} border border-cyan-500/10`}>{s.icon}</div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">{s.label}</p>
                  <p className="text-2xl font-black text-[var(--text-primary)]">{statusCounts[s.key]}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8 animate-fadeInUp stagger-2 opacity-0">
          <div className="md:col-span-8 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-cyan-400 transition-colors" />
            <input type="text" placeholder="Search by name or description..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              className="w-full glass rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-cyan-500/40 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] text-sm" />
          </div>
          <div className="md:col-span-4 relative">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full glass rounded-2xl py-3.5 px-5 appearance-none focus:outline-none focus:border-cyan-500/40 cursor-pointer text-[var(--text-secondary)] text-sm">
              <option className="bg-[#080D1F]" value="newest">Newest First</option>
              <option className="bg-[#080D1F]" value="oldest">Oldest First</option>
              <option className="bg-[#080D1F]" value="a-z">Name: A-Z</option>
              <option className="bg-[#080D1F]" value="z-a">Name: Z-A</option>
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-28 animate-fadeInScale">
            <div className="w-14 h-14 border-2 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin mx-auto mb-5" />
            <p className="text-cyan-500/60 font-bold uppercase tracking-[0.3em] text-xs">Loading</p>
          </div>
        ) : err ? (
          <div className="text-center py-28 animate-fadeInScale">
            <FiAlertCircle className="text-4xl text-red-400 mx-auto mb-4" />
            <p className="text-red-400 font-bold">{err}</p>
          </div>
        ) : currentData.length > 0 ? (
          <div className="space-y-4">
            {currentData.map((c, i) => {
              const id = c.id || c._id
              const status = c.status?.toLowerCase() || 'pending'
              const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
              return (
                <div key={id} className={`group relative overflow-hidden rounded-2xl border-l-[3px] ${config.cardBorder} border border-cyan-500/10 hover:border-cyan-500/10 transition-all duration-500 hover:shadow-xl animate-fadeInUp opacity-0`} style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-primary)] group-hover:from-[#0d1630] group-hover:to-[#0a1128] transition-all duration-500" />
                  <div className="noise absolute inset-0" />
                  <div className="relative p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors">{c.employeeName || 'Unknown'}</h3>
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${config.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />{status}
                          </span>
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm mb-3">{c.description || 'No description'}</p>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]"><FiCalendar className="text-cyan-500/50" /><span className="font-medium">Applied: {c.appliedDate || 'N/A'}</span></div>
                      </div>
                      <div className="flex lg:flex-col gap-3 flex-shrink-0">
                        <select value={status} onChange={(e) => handleStatusChange(id, e.target.value)}
                          className="bg-[var(--bg-secondary)] border border-cyan-500/10 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase cursor-pointer outline-none focus:border-cyan-500/30 text-[var(--text-secondary)] min-w-[130px] hover:border-white/15 transition-all">
                          <option className="bg-[var(--bg-secondary)]" value="pending">Pending</option>
                          <option className="bg-[var(--bg-secondary)]" value="approved">Approved</option>
                          <option className="bg-[var(--bg-secondary)]" value="rejected">Rejected</option>
                        </select>
                        <button onClick={() => handleDelete(id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/[0.04] text-red-400/70 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-[var(--text-primary)] hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 transition-all text-xs font-bold">
                          <FiTrash2 size={14} /><span className="hidden lg:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-28 text-center border border-dashed border-cyan-500/10 rounded-[2rem] bg-[var(--bg-secondary)] animate-fadeInScale">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/[0.02] border border-cyan-500/10 flex items-center justify-center"><FiAlertCircle className="text-2xl text-[var(--text-secondary)]" /></div>
            <p className="text-[var(--text-secondary)] font-bold text-lg">No leave requests found</p>
            <p className="text-[var(--text-secondary)] text-sm mt-1">Adjust filters to see results</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ${currentPage === i + 1 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-[var(--text-primary)] shadow-lg shadow-cyan-500/25' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] border border-cyan-500/10'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <ToastContainer theme={isDarkMode ? "dark" : "light"} position="bottom-right" autoClose={2500} toastClassName="!bg-[var(--bg-secondary)] !border !border-cyan-500/10 !rounded-2xl !shadow-2xl" />
    </div>
  )
}

export default Leaves
