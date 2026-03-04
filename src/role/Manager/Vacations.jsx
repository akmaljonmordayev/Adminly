import React, { useEffect, useState, useMemo, useCallback } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FiCalendar, FiUser, FiSearch, FiChevronDown, FiAlertCircle, FiCheckCircle, FiClock, FiXCircle, FiSun, FiTrash2 } from 'react-icons/fi'

const API_BASE = 'http://localhost:5000/vacations'

const STATUS_CONFIG = {
  pending: { dot: 'bg-amber-400 shadow-amber-400/50', badge: 'text-amber-300 border-amber-400/20 bg-gradient-to-r from-amber-500/10 to-amber-600/5' },
  approved: { dot: 'bg-emerald-400 shadow-emerald-400/50', badge: 'text-emerald-300 border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5' },
  rejected: { dot: 'bg-red-400 shadow-red-400/50', badge: 'text-red-300 border-red-400/20 bg-gradient-to-r from-red-500/10 to-red-600/5' },
}

function Vacations() {
  const [vacations, setVacations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try { const res = await axios.get(API_BASE); setVacations(res.data) }
    catch { toast.error('Failed to load vacations') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const availableYears = useMemo(() => [...new Set(vacations.map((v) => v.startDate?.substring(0, 4)).filter(Boolean))].sort((a, b) => b.localeCompare(a)), [vacations])

  const processedData = useMemo(() => {
    let filtered = vacations.filter((v) => {
      const ms = v.employeeName?.toLowerCase().includes(search.toLowerCase())
      const mst = statusFilter === 'all' || v.status?.toLowerCase() === statusFilter
      const my = selectedYear === 'all' || v.startDate?.startsWith(selectedYear)
      return ms && mst && my
    })
    return filtered.sort((a, b) => {
      if (sort === 'newest') return (b.startDate || '').localeCompare(a.startDate || '')
      if (sort === 'oldest') return (a.startDate || '').localeCompare(b.startDate || '')
      if (sort === 'a-z') return (a.employeeName || '').localeCompare(b.employeeName || '')
      return (b.employeeName || '').localeCompare(a.employeeName || '')
    })
  }, [vacations, search, statusFilter, selectedYear, sort])

  const statusCounts = useMemo(() => {
    const yf = selectedYear === 'all' ? vacations : vacations.filter((v) => v.startDate?.startsWith(selectedYear))
    return { all: yf.length, pending: yf.filter((v) => v.status?.toLowerCase() === 'pending').length, approved: yf.filter((v) => v.status?.toLowerCase() === 'approved').length, rejected: yf.filter((v) => v.status?.toLowerCase() === 'rejected').length }
  }, [vacations, selectedYear])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/${id}`, { status: newStatus })
      setVacations((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)))
      toast.success('Status updated')
      await axios.post('http://localhost:5000/logs', { userName: user.name, action: 'UPDATE', date: new Date().toISOString(), page: 'VACATIONS' })
    } catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return
    try {
      await axios.delete(`${API_BASE}/${id}`)
      setVacations((prev) => prev.filter((item) => item.id !== id))
      toast.success('Deleted')
      await axios.post('http://localhost:5000/logs', { userName: user.name, action: 'DELETE', date: new Date().toISOString(), page: 'VACATIONS' })
    } catch { toast.error('Delete failed') }
  }

  const getDays = (start, end) => {
    if (!start || !end) return 0
    return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[20%] w-[45%] h-[45%] bg-emerald-900/8 blur-[150px] rounded-full animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/8 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-[1500px] mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 animate-fadeInUp">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">VACATIONS</span>
            </h1>
            <p className="text-slate-600 text-xs font-medium mt-1.5 tracking-wider uppercase">Manage employee vacation requests</p>
          </div>
          <div className="flex items-center gap-2 glass rounded-2xl p-1.5">
            <button onClick={() => setSelectedYear('all')} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${selectedYear === 'all' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>All</button>
            {availableYears.map((y) => (
              <button key={y} onClick={() => setSelectedYear(y)} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${selectedYear === y ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>{y}</button>
            ))}
          </div>
        </header>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fadeInUp stagger-1 opacity-0">
          {[
            { key: 'all', label: 'Total', icon: <FiSun />, gradient: 'from-cyan-500/15 to-teal-500/5', iconColor: 'text-cyan-400', borderColor: 'border-cyan-500/20 hover:border-cyan-400/40' },
            { key: 'pending', label: 'Pending', icon: <FiClock />, gradient: 'from-amber-500/15 to-orange-500/5', iconColor: 'text-amber-400', borderColor: 'border-amber-500/20 hover:border-amber-400/40' },
            { key: 'approved', label: 'Approved', icon: <FiCheckCircle />, gradient: 'from-emerald-500/15 to-green-500/5', iconColor: 'text-emerald-400', borderColor: 'border-emerald-500/20 hover:border-emerald-400/40' },
            { key: 'rejected', label: 'Rejected', icon: <FiXCircle />, gradient: 'from-red-500/15 to-rose-500/5', iconColor: 'text-red-400', borderColor: 'border-red-500/20 hover:border-red-400/40' },
          ].map((s) => (
            <button key={s.key} onClick={() => setStatusFilter(s.key)} className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-500 text-left group cursor-pointer ${s.borderColor} ${statusFilter === s.key ? 'ring-1 ring-white/10 bg-[#0a1128]' : 'bg-[#060d1f]'}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="noise absolute inset-0 rounded-2xl" />
              <div className="relative flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${s.iconColor} border border-white/5`}>{s.icon}</div>
                <div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">{s.label}</p><p className="text-2xl font-black text-white">{statusCounts[s.key]}</p></div>
              </div>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8 animate-fadeInUp stagger-2 opacity-0">
          <div className="md:col-span-8 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
            <input type="text" placeholder="Search by employee name..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full glass rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-cyan-500/40 transition-all text-white placeholder:text-slate-700 text-sm" />
          </div>
          <div className="md:col-span-4 relative">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full glass rounded-2xl py-3.5 px-5 appearance-none focus:outline-none focus:border-cyan-500/40 cursor-pointer text-slate-400 text-sm">
              <option className="bg-[#060d1f]" value="newest">Newest First</option><option className="bg-[#060d1f]" value="oldest">Oldest First</option>
              <option className="bg-[#060d1f]" value="a-z">Name: A-Z</option><option className="bg-[#060d1f]" value="z-a">Name: Z-A</option>
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-28 animate-fadeInScale">
            <div className="w-14 h-14 border-2 border-slate-800 border-t-cyan-500 rounded-full animate-spin mx-auto mb-5" />
            <p className="text-cyan-500/60 font-bold uppercase tracking-[0.3em] text-xs">Loading</p>
          </div>
        ) : processedData.length > 0 ? (
          <div className="space-y-4">
            {processedData.map((v, i) => {
              const status = v.status?.toLowerCase() || 'pending'
              const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
              const days = getDays(v.startDate, v.endDate)
              return (
                <div key={v.id} className="group relative overflow-hidden rounded-2xl border border-white/[0.04] hover:border-white/10 transition-all duration-500 hover:shadow-xl animate-fadeInUp opacity-0" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a1128] to-[#060d1f] group-hover:from-[#0d1630] group-hover:to-[#0a1128] transition-all duration-500" />
                  <div className="noise absolute inset-0" />
                  <div className="relative p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/5 border border-cyan-500/20 flex items-center justify-center">
                            <FiUser className="text-cyan-400 text-sm" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{v.employeeName}</h3>
                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />{status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-3">
                          <div className="flex items-center gap-2"><FiCalendar className="text-cyan-500/50" /><span className="font-medium">{v.startDate}</span><span className="text-slate-700">→</span><span className="font-medium">{v.endDate}</span></div>
                          <div className="px-3 py-1 bg-white/[0.03] rounded-lg text-[10px] font-black text-slate-400 border border-white/[0.04]">{days} day{days !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                      <div className="flex lg:flex-col gap-3 flex-shrink-0">
                        <select value={status} onChange={(e) => handleStatusChange(v.id, e.target.value)}
                          className="bg-[#060d1f] border border-white/[0.06] rounded-xl px-4 py-2.5 text-[10px] font-black uppercase cursor-pointer outline-none focus:border-cyan-500/30 text-slate-400 min-w-[130px] hover:border-white/15 transition-all">
                          <option className="bg-[#060d1f]" value="pending">Pending</option><option className="bg-[#060d1f]" value="approved">Approved</option><option className="bg-[#060d1f]" value="rejected">Rejected</option>
                        </select>
                        <button onClick={() => handleDelete(v.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/[0.04] text-red-400/70 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 transition-all text-xs font-bold">
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
          <div className="py-28 text-center border border-dashed border-white/[0.06] rounded-[2rem] bg-[#060d1f] animate-fadeInScale">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center"><FiAlertCircle className="text-2xl text-slate-700" /></div>
            <p className="text-slate-600 font-bold text-lg">No vacations found</p>
            <p className="text-slate-700 text-sm mt-1">Adjust filters to see results</p>
          </div>
        )}
      </div>
      <ToastContainer theme="dark" position="bottom-right" autoClose={2500} toastClassName="!bg-[#0a1128] !border !border-white/10 !rounded-2xl !shadow-2xl" />
    </div>
  )
}

export default Vacations
