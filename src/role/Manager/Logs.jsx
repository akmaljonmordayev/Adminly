import { useTheme } from '../../context/ThemeContext';
import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import {
  FiSearch, FiPlusCircle, FiEdit, FiTrash2, FiUser, FiLayers,
  FiChevronLeft, FiChevronRight, FiChevronDown, FiAlertCircle,
  FiFilter, FiCalendar, FiClock, FiActivity, FiArrowRight, FiTarget
} from 'react-icons/fi'
import { toast, ToastContainer } from 'react-toastify'

const LOGS_URL = 'http://localhost:5000/logs'

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getRelativeTime = (date) => {
  if (!date) return ''
  const now = new Date()
  const then = new Date(date)
  const diff = Math.abs(now - then) / 1000

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function Logs() {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [pageFilter, setPageFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLog, setSelectedLog] = useState(null)

  const itemsPerPage = 8

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await axios.get(LOGS_URL)
        setData(data)
      } catch {
        setError('Failed to sync logs')
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const uniquePages = useMemo(() => {
    const pages = data.map(log => log.page).filter(Boolean)
    return ['all', ...new Set(pages)]
  }, [data])

  const filteredAndSortedData = useMemo(() => {
    let result = data.filter((log) => {
      const ms = log.userName?.toLowerCase().includes(search.toLowerCase()) ||
        log.action?.toLowerCase().includes(search.toLowerCase())
      const af = actionFilter === 'all' || log.action?.toLowerCase().includes(actionFilter)
      const pf = pageFilter === 'all' || log.page === pageFilter
      return ms && af && pf
    })

    return result.sort((a, b) => {
      const dateA = new Date(a.date || 0)
      const dateB = new Date(b.date || 0)
      if (sortOrder === 'newest') return dateB - dateA
      if (sortOrder === 'oldest') return dateA - dateB
      return (a.userName || '').localeCompare(b.userName || '')
    })
  }, [data, search, actionFilter, pageFilter, sortOrder])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const currentItems = filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => { setCurrentPage(1) }, [search, actionFilter, pageFilter])

  const getActionConfig = (action) => {
    const k = action?.toLowerCase() || ''
    if (k.includes('create') || k.includes('add')) return {
      icon: <FiPlusCircle />,
      color: 'emerald',
      label: 'Creation'
    }
    if (k.includes('update') || k.includes('edit')) return {
      icon: <FiEdit />,
      color: 'amber',
      label: 'Modification'
    }
    if (k.includes('delete') || k.includes('remove')) return {
      icon: <FiTrash2 />,
      color: 'red',
      label: 'Deletion'
    }
    return {
      icon: <FiActivity />,
      color: 'blue',
      label: 'Interaction'
    }
  }

  const handleDeleteLog = async (id) => {
    if (!window.confirm('Delete this log entry?')) return
    try {
      await axios.delete(`${LOGS_URL}/${id}`)
      setData(prev => prev.filter(item => item.id !== id))
      toast.error('Log entry removed')
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative transition-colors duration-500">
      {/* Dynamic Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[15%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] left-[5%] w-[35%] h-[35%] bg-purple-500/5 blur-[120px] rounded-full animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fadeInUp">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center shadow-xl shadow-cyan-500/10 group">
                <FiLayers size={24} className="text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Audit</span> Records
                </h1>
                <p className="text-[var(--text-secondary)] text-[10px] font-black mt-2 tracking-[0.3em] uppercase opacity-60">System-wide activity monitoring</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass-strong px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="text-right">
                <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest leading-none mb-1">Total Logs</p>
                <p className="text-xl font-black text-[var(--text-primary)] leading-none">{data.length}</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-right">
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Status</p>
                <p className="text-xs font-bold text-emerald-400 leading-none">Live Sync</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 animate-fadeInUp stagger-1 opacity-0">
            <div className="glass-strong rounded-[2rem] p-6 border border-white/5 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <FiFilter className="text-cyan-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">Refine View</h3>
              </div>

              <div className="space-y-5">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Universal Search</label>
                  <div className="relative group">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="User or Action..."
                      className="w-full bg-[var(--bg-primary)] border border-white/5 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-cyan-500/30 transition-all text-xs text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                {/* Action Type */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Action Type</label>
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-white/5 rounded-2xl py-3 px-4 outline-none focus:border-cyan-500/30 transition-all text-xs text-[var(--text-primary)] appearance-none cursor-pointer hover:bg-white/5"
                  >
                    <option value="all">All Operations</option>
                    <option value="create">Creations</option>
                    <option value="update">Updates</option>
                    <option value="delete">Deletions</option>
                  </select>
                </div>

                {/* Module Filter */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Module Location</label>
                  <select
                    value={pageFilter}
                    onChange={(e) => setPageFilter(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-white/5 rounded-2xl py-3 px-4 outline-none focus:border-cyan-500/30 transition-all text-xs text-[var(--text-primary)] appearance-none cursor-pointer hover:bg-white/5"
                  >
                    {uniquePages.map(page => (
                      <option key={page} value={page}>{page === 'all' ? 'Everywhere' : page}</option>
                    ))}
                  </select>
                </div>

                {/* Sorting */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Temporality</label>
                  <div className="flex gap-2">
                    {['newest', 'oldest'].map(ord => (
                      <button
                        key={ord}
                        onClick={() => setSortOrder(ord)}
                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${sortOrder === ord ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:bg-white/10'}`}
                      >
                        {ord}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600/20 to-blue-700/10 rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group">
              <FiAlertCircle className="absolute -right-4 -bottom-4 text-7xl text-white/5 group-hover:text-white/10 transition-all group-hover:scale-110" />
              <h4 className="text-xs font-black text-white/90 uppercase tracking-widest mb-2 italic">Data Security</h4>
              <p className="text-[10px] text-white/60 font-medium leading-relaxed">System logs are stored for 180 days before automated rotation.</p>
            </div>
          </aside>

          {/* Activity Feed */}
          <section className="lg:col-span-9 space-y-4 animate-fadeInUp stagger-2 opacity-0 min-h-[600px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-12 h-12 border-2 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/60 animate-pulse">Synchronizing Feed...</p>
              </div>
            ) : error ? (
              <div className="text-center py-24 glass rounded-[3rem] border border-red-500/20">
                <FiAlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-black text-red-400 uppercase">{error}</h3>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
                <div className="w-20 h-20 mx-auto mb-6 rounded-[2rem] bg-cyan-500/5 flex items-center justify-center text-cyan-400/30 border border-cyan-500/10">
                  <FiActivity size={48} />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">No Activity Logged</h3>
                <p className="text-[var(--text-secondary)] text-xs mt-2 uppercase tracking-widest font-black opacity-40">Adjust filters to see historical data</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {currentItems.map((log, i) => {
                    const cfg = getActionConfig(log.action)
                    return (
                      <div
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        className="group relative glass-strong rounded-3xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-0.5 cursor-pointer animate-fadeInUp opacity-0"
                        style={{ animationDelay: `${i * 0.04}s` }}
                      >
                        <div className={`absolute top-0 left-0 w-1.5 h-full bg-${cfg.color}-500/40 group-hover:bg-${cfg.color}-500 transition-colors`} />

                        <div className="flex flex-col md:flex-row items-center gap-6 p-5">
                          {/* User Avatar Placeholder */}
                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400/50 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-all flex-shrink-0">
                            <FiUser size={24} />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-sm font-black text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors uppercase tracking-tight truncate">{log.userName}</h3>
                              {log.page && (
                                <span className="text-[9px] font-black text-[var(--text-secondary)] bg-white/5 px-3 py-1 rounded-lg uppercase tracking-widest border border-white/5">{log.page}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-[10px] text-[var(--text-secondary)] font-bold">
                              <span className="flex items-center gap-1.5"><FiClock className="text-cyan-500" /> {formatDate(log.date)}</span>
                              <span className="text-cyan-500/40 font-black">·</span>
                              <span className="text-cyan-400 opacity-80">{getRelativeTime(log.date)}</span>
                            </div>
                          </div>

                          {/* Action Badge */}
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border bg-${cfg.color}-500/10 border-${cfg.color}-500/20 text-${cfg.color}-400 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-${cfg.color}-500/5`}>
                              {cfg.icon}
                              <span>{log.action}</span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteLog(log.id)
                              }}
                              className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-400 border border-white/10 transition-all active:scale-90 flex items-center justify-center opacity-0 group-hover:opacity-100"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 pt-8">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'glass hover:bg-cyan-500/10 hover:text-cyan-400 border border-white/5'}`}
                    >
                      <FiChevronLeft size={20} />
                    </button>

                    <div className="flex h-12 glass rounded-2xl p-1 gap-1 border border-white/5">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-4 rounded-xl font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : 'glass hover:bg-cyan-500/10 hover:text-cyan-400 border border-white/5'}`}
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        {/* PREMIUM LOG MODAL */}
        {selectedLog && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fadeInScale"
            onClick={() => setSelectedLog(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="glass-strong max-w-xl w-full rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.15)] animate-fadeInScale"
            >
              <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-8 text-white relative flex flex-col items-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="relative z-10 w-20 h-20 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 shadow-2xl">
                  <FiTarget size={36} />
                </div>
                <h2 className="relative z-10 text-2xl font-black uppercase tracking-tighter">Event Details</h2>
                <p className="relative z-10 text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Transaction Identity: #{String(selectedLog.id || '').slice(-8)}</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LogDetailBlock label="Initiated By" value={selectedLog.userName} icon={<FiUser />} />
                  <LogDetailBlock label="Action Type" value={selectedLog.action} icon={<FiActivity />} color="text-cyan-400" />
                  <LogDetailBlock label="Page Source" value={selectedLog.page || 'System'} icon={<FiLayers />} />
                  <LogDetailBlock label="Exact Timestamp" value={formatDate(selectedLog.date)} icon={<FiClock />} />
                </div>

                <div className="bg-[var(--bg-primary)] rounded-3xl p-6 border border-white/5">
                  <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FiArrowRight size={10} /> Metadata Context
                  </p>
                  <div className="text-xs font-medium text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-secondary)] p-4 rounded-2xl border border-white/5">
                    {/* This could be more dynamic if the data provided it */}
                    Successfull {selectedLog.action} operation on {selectedLog.page || 'system default'}. Transaction verified and persistent.
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLog(null)}
                  className="w-full py-4 rounded-[1.5rem] bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all"
                >
                  Confirm & Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        theme={isDarkMode ? 'dark' : 'light'}
        position="bottom-right"
        autoClose={2500}
        toastClassName="!rounded-2xl !bg-[var(--bg-secondary)] !border !border-white/5 !shadow-2xl"
      />
    </div>
  )
}

const LogDetailBlock = ({ label, value, icon, color = "text-[var(--text-primary)]" }) => (
  <div className="space-y-1.5">
    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-60 flex items-center gap-1.5 leading-none">
      {icon} {label}
    </p>
    <p className={`text-sm font-black uppercase tracking-tight ${color}`}>{value}</p>
  </div>
)

export default Logs
