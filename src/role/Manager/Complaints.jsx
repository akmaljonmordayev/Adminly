import axios from 'axios'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import {
  FiSearch,
  FiTrash2,
  FiCalendar,
  FiUser,
  FiChevronDown,
  FiAlertCircle,
  FiMessageSquare,
} from 'react-icons/fi'
import 'react-toastify/dist/ReactToastify.css'
import { useTheme } from '../../context/ThemeContext'

const API = 'http://localhost:5000'

const STATUS_CONFIG = {
  pending: {
    dot: 'bg-[var(--bg-secondary)]mber-400 shadow-amber-400/50',
    badge: 'text-amber-300 border-amber-400/25 bg-gradient-to-r from-amber-500/10 to-amber-600/5',
    glow: 'hover:shadow-amber-500/5',
  },
  reviewed: {
    dot: 'bg-cyan-400 shadow-cyan-400/50',
    badge: 'text-cyan-300 border-cyan-400/25 bg-gradient-to-r from-cyan-500/10 to-cyan-600/5',
    glow: 'hover:shadow-cyan-500/5',
  },
  resolved: {
    dot: 'bg-emerald-400 shadow-emerald-400/50',
    badge: 'text-emerald-300 border-emerald-400/25 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5',
    glow: 'hover:shadow-emerald-500/5',
  },
}

function ComplaintsAdmin() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isDarkMode } = useTheme()

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

  useEffect(() => { fetchData() }, [fetchData])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API}/complaints/${id}`, { status: newStatus })
      setData((prev) => prev.map((item) => item.id === id ? { ...item, status: newStatus } : item))
      toast.success(`Status → ${newStatus}`)
      await axios.post(`${API}/logs`, { userName: user.name, action: 'UPDATE', date: new Date().toISOString(), page: 'COMPLAINTS' })
    } catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete?')) return
    try {
      const target = data.find((i) => i.id === id)
      await axios.post(`${API}/complaintsDeleted`, target)
      await axios.delete(`${API}/complaints/${id}`)
      setData((prev) => prev.filter((item) => item.id !== id))
      toast.warning('Complaint archived')
      await axios.post(`${API}/logs`, { userName: user.name, action: 'DELETE', date: new Date().toISOString(), page: 'COMPLAINTS' })
    } catch { toast.error('Delete failed') }
  }

  const availableYears = useMemo(() => {
    const years = [...new Set(data.map((c) => c.date?.substring(0, 4)).filter(Boolean))]
    return years.sort((a, b) => b.localeCompare(a))
  }, [data])

  const processedData = useMemo(() => {
    let filtered = data.filter((c) => {
      const matchesSearch = c.title?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()) || c.employeeName?.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || c.status?.toLowerCase() === statusFilter
      const matchesYear = selectedYear === 'all' || c.date?.startsWith(selectedYear)
      return matchesSearch && matchesStatus && matchesYear
    })
    return filtered.sort((a, b) => {
      if (sort === 'newest') return (b.date || '').localeCompare(a.date || '')
      if (sort === 'oldest') return (a.date || '').localeCompare(b.date || '')
      if (sort === 'a-z') return (a.title || '').localeCompare(b.title || '')
      return (b.title || '').localeCompare(a.title || '')
    })
  }, [data, search, statusFilter, selectedYear, sort])

  const statusCounts = useMemo(() => {
    const yf = selectedYear === 'all' ? data : data.filter((c) => c.date?.startsWith(selectedYear))
    return {
      all: yf.length,
      pending: yf.filter((c) => c.status?.toLowerCase() === 'pending').length,
      reviewed: yf.filter((c) => c.status?.toLowerCase() === 'reviewed').length,
      resolved: yf.filter((c) => c.status?.toLowerCase() === 'resolved').length,
    }
  }, [data, selectedYear])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center animate-fadeInScale">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <FiAlertCircle className="text-3xl text-red-400" />
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)] mb-2">{error}</p>
          <button onClick={fetchData} className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-[var(--text-primary)] font-bold rounded-xl mt-3 hover:shadow-lg hover:shadow-cyan-500/20 transition-all">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-red-900/8 blur-[150px] rounded-full animate-float" />
        <div className="absolute bottom-[-20%] left-[-5%] w-[40%] h-[40%] bg-cyan-900/8 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-[1500px] mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 animate-fadeInUp">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              <span className="bg-gradient-to-r from-red-400 via-rose-400 to-pink-400 bg-clip-text text-transparent">COMPLAINTS</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-xs font-medium mt-1.5 tracking-wider uppercase">Manage & resolve employee complaints</p>
          </div>
          <div className="flex items-center gap-2 glass rounded-2xl p-1.5">
            <button onClick={() => setSelectedYear('all')} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${selectedYear === 'all' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-[var(--text-primary)] shadow-lg shadow-cyan-500/25' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-cyan-500/5'}`}>All</button>
            {availableYears.map((y) => (
              <button key={y} onClick={() => setSelectedYear(y)} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${selectedYear === y ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-[var(--text-primary)] shadow-lg shadow-cyan-500/25' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-cyan-500/5'}`}>{y}</button>
            ))}
          </div>
        </header>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fadeInUp stagger-1 opacity-0">
          {[
            { key: 'all', label: 'Total', icon: <FiMessageSquare />, gradient: 'from-cyan-500/15 to-blue-500/5', iconColor: 'text-cyan-400', dotColor: 'bg-cyan-400', borderColor: 'border-cyan-500/20 hover:border-cyan-400/40' },
            { key: 'pending', label: 'Pending', icon: <FiAlertCircle />, gradient: 'from-amber-500/15 to-orange-500/5', iconColor: 'text-amber-400', dotColor: 'bg-[var(--bg-secondary)]mber-400', borderColor: 'border-amber-500/20 hover:border-amber-400/40' },
            { key: 'reviewed', label: 'Reviewed', icon: <FiSearch />, gradient: 'from-blue-500/15 to-indigo-500/5', iconColor: 'text-blue-400', dotColor: 'bg-blue-400', borderColor: 'border-blue-500/20 hover:border-blue-400/40' },
            { key: 'resolved', label: 'Resolved', icon: <FiCalendar />, gradient: 'from-emerald-500/15 to-green-500/5', iconColor: 'text-emerald-400', dotColor: 'bg-emerald-400', borderColor: 'border-emerald-500/20 hover:border-emerald-400/40' },
          ].map((s) => (
            <button key={s.key} onClick={() => setStatusFilter(s.key)}
              className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-500 text-left group cursor-pointer ${s.borderColor} ${statusFilter === s.key ? 'ring-1 ring-white/10 bg-[var(--bg-secondary)]' : 'bg-[var(--bg-secondary)]'}`}
            >
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
            <input type="text" placeholder="Search by title, description or employee..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full glass rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-cyan-500/40 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] text-sm" />
          </div>
          <div className="md:col-span-4 relative">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full glass rounded-2xl py-3.5 px-5 appearance-none focus:outline-none focus:border-cyan-500/40 cursor-pointer text-[var(--text-secondary)] text-sm">
              <option className="bg-[#080D1F]" value="newest">Newest First</option>
              <option className="bg-[#080D1F]" value="oldest">Oldest First</option>
              <option className="bg-[#080D1F]" value="a-z">Title: A-Z</option>
              <option className="bg-[#080D1F]" value="z-a">Title: Z-A</option>
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-28 animate-fadeInScale">
              <div className="w-14 h-14 border-2 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin mx-auto mb-5" />
              <p className="text-cyan-500/60 font-bold uppercase tracking-[0.3em] text-xs">Loading complaints</p>
            </div>
          ) : processedData.length > 0 ? (
            processedData.map((item, i) => {
              const cfg = STATUS_CONFIG[item.status?.toLowerCase()] || STATUS_CONFIG.pending
              return (
                <div key={item.id} className={`group relative overflow-hidden rounded-2xl border border-cyan-500/10 hover:border-cyan-500/10 transition-all duration-500 ${cfg.glow} hover:shadow-xl animate-fadeInUp opacity-0`} style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-primary)] group-hover:from-[#0d1630] group-hover:to-[#0a1128] transition-all duration-500" />
                  <div className="noise absolute inset-0" />
                  <div className="relative p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${cfg.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shadow-sm`} />
                            {item.status || 'NEW'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-cyan-400 transition-colors duration-300">{item.title}</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-5 text-xs text-[var(--text-secondary)]">
                          <div className="flex items-center gap-2"><FiUser className="text-cyan-500/50" /><span className="font-medium">{item.employeeName || 'System'}</span></div>
                          <div className="flex items-center gap-2"><FiCalendar className="text-cyan-500/50" /><span className="font-medium">{item.date || 'N/A'}</span></div>
                        </div>
                      </div>
                      <div className="flex lg:flex-col gap-3 flex-shrink-0">
                        <select value={item.status || 'pending'} onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="bg-[var(--bg-secondary)] border border-cyan-500/10 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase cursor-pointer outline-none focus:border-cyan-500/30 text-[var(--text-secondary)] min-w-[130px] hover:border-white/15 transition-all">
                          <option className="bg-[var(--bg-secondary)]" value="pending">Pending</option>
                          <option className="bg-[var(--bg-secondary)]" value="reviewed">Reviewed</option>
                          <option className="bg-[var(--bg-secondary)]" value="resolved">Resolved</option>
                        </select>
                        <button onClick={() => handleDelete(item.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/[0.04] text-red-400/70 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-[var(--text-primary)] hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 transition-all text-xs font-bold">
                          <FiTrash2 size={14} /><span className="hidden lg:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-28 text-center border border-dashed border-cyan-500/10 rounded-[2rem] bg-[var(--bg-secondary)] animate-fadeInScale">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/[0.02] border border-cyan-500/10 flex items-center justify-center">
                <FiAlertCircle className="text-2xl text-[var(--text-secondary)]" />
              </div>
              <p className="text-[var(--text-secondary)] font-bold text-lg">No complaints found</p>
              <p className="text-[var(--text-secondary)] text-sm mt-1">Adjust filters to see results</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer theme={isDarkMode ? "dark" : "light"} position="bottom-right" autoClose={2500} toastClassName="!bg-[var(--bg-secondary)] !border !border-cyan-500/10 !rounded-2xl !shadow-2xl" />
    </div>
  )
}

export default ComplaintsAdmin
