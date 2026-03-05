import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { FiSearch, FiPlusCircle, FiEdit, FiTrash2, FiUser, FiLayers, FiChevronLeft, FiChevronRight, FiChevronDown, FiAlertCircle } from 'react-icons/fi'

const LOGS_URL = 'http://localhost:5000/logs'

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function Logs() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('a-z')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLog, setSelectedLog] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)
  const itemsPerPage = 8

  const handleContextMenu = (e, log) => { e.preventDefault(); setContextMenu({ x: e.pageX, y: e.pageY, log }) }

  useEffect(() => {
    const fetchLogs = async () => {
      try { const { data } = await axios.get(LOGS_URL); setData(data) }
      catch { setError('Logs not found') }
      finally { setLoading(false) }
    }
    fetchLogs()
  }, [])

  const filteredAndSortedData = useMemo(() => {
    let result = data.filter((log) => {
      const ms = log.userName?.toLowerCase().includes(search.toLowerCase())
      const mst = statusFilter === 'all' || log.action?.toLowerCase().includes(statusFilter)
      return ms && mst
    })
    return result.sort((a, b) => {
      const nA = a.userName?.toLowerCase() || ''
      const nB = b.userName?.toLowerCase() || ''
      return sortOrder === 'a-z' ? nA.localeCompare(nB) : nB.localeCompare(nA)
    })
  }, [data, search, statusFilter, sortOrder])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const currentItems = filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => { setCurrentPage(1) }, [search, statusFilter])

  const actionConfig = {
    create: { icon: <FiPlusCircle size={13} />, style: 'text-emerald-300 border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5', dot: 'bg-emerald-400 shadow-emerald-400/50' },
    update: { icon: <FiEdit size={13} />, style: 'text-amber-300 border-amber-400/20 bg-gradient-to-r from-amber-500/10 to-amber-600/5', dot: 'bg-amber-400 shadow-amber-400/50' },
    delete: { icon: <FiTrash2 size={13} />, style: 'text-red-300 border-red-400/20 bg-gradient-to-r from-red-500/10 to-red-600/5', dot: 'bg-red-400 shadow-red-400/50' },
  }

  const getConfig = (action) => {
    const k = action?.toLowerCase() || ''
    if (k.includes('create')) return actionConfig.create
    if (k.includes('update')) return actionConfig.update
    if (k.includes('delete')) return actionConfig.delete
    return { icon: null, style: 'text-slate-400 border-white/10 bg-white/5', dot: 'bg-slate-400' }
  }

  return (
    <>
      <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative" onClick={() => setContextMenu(null)}>
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[10%] w-[35%] h-[35%] bg-cyan-900/8 blur-[120px] rounded-full animate-float" />
          <div className="absolute bottom-[-15%] left-[-5%] w-[30%] h-[30%] bg-purple-900/8 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 p-4 md:p-8 max-w-[900px] mx-auto">
          {/* Header */}
          <header className="mb-10 animate-fadeInUp">
            <div className="flex items-center gap-4 pb-6 border-b border-white/[0.04]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center">
                <FiLayers size={20} className="text-cyan-400" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AUDIT</span>
                  <span className="text-white ml-2">LOGS</span>
                </h1>
                <p className="text-slate-600 text-xs font-medium mt-0.5 tracking-wider uppercase">
                  {data.length} total entries
                </p>
              </div>
            </div>
          </header>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 animate-fadeInUp stagger-1 opacity-0">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
                className="w-full glass rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-700 text-sm" />
            </div>
            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full glass rounded-2xl py-3 px-5 appearance-none outline-none focus:border-cyan-500/40 cursor-pointer text-slate-400 text-sm">
                <option className="bg-[#060d1f]" value="all">All Actions</option><option className="bg-[#060d1f]" value="create">Create</option>
                <option className="bg-[#060d1f]" value="update">Update</option><option className="bg-[#060d1f]" value="delete">Delete</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full glass rounded-2xl py-3 px-5 appearance-none outline-none focus:border-cyan-500/40 cursor-pointer text-slate-400 text-sm">
                <option className="bg-[#060d1f]" value="a-z">Name: A–Z</option><option className="bg-[#060d1f]" value="z-a">Name: Z–A</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
            </div>
          </div>

          {/* Logs List */}
          <div className="space-y-3 mb-10 min-h-[400px]">
            {loading ? (
              <div className="text-center py-28 animate-fadeInScale">
                <div className="w-14 h-14 border-2 border-slate-800 border-t-cyan-500 rounded-full animate-spin mx-auto mb-5" />
                <p className="text-cyan-500/60 font-bold uppercase tracking-[0.3em] text-xs">Loading</p>
              </div>
            ) : error ? (
              <div className="text-center py-28 animate-fadeInScale"><FiAlertCircle className="text-4xl text-red-400 mx-auto mb-4" /><p className="text-red-400 font-bold">{error}</p></div>
            ) : currentItems.length === 0 ? (
              <div className="py-28 text-center border border-dashed border-white/[0.06] rounded-[2rem] bg-[#060d1f] animate-fadeInScale">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center"><FiLayers className="text-2xl text-slate-700" /></div>
                <p className="text-slate-600 font-bold text-lg">No logs found</p>
              </div>
            ) : (
              currentItems.map((log, i) => {
                const cfg = getConfig(log.action)
                return (
                  <div key={log.id} onClick={() => setSelectedLog(log)} onContextMenu={(e) => handleContextMenu(e, log)}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.04] hover:border-white/10 transition-all duration-500 cursor-pointer hover:shadow-xl animate-fadeInUp opacity-0" style={{ animationDelay: `${i * 0.04}s` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a1128] to-[#060d1f] group-hover:from-[#0d1630] group-hover:to-[#0a1128] transition-all duration-500" />
                    <div className="noise absolute inset-0" />
                    <div className="relative flex items-center justify-between p-5">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/5 border border-cyan-500/15 flex items-center justify-center flex-shrink-0">
                          <FiUser className="text-cyan-400/70 text-sm" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-sm group-hover:text-cyan-400 transition-colors">{log.userName}</h3>
                          <div className="flex items-center gap-3 mt-0.5">
                            <p className="text-slate-600 text-[10px] font-medium">{formatDate(log.date)}</p>
                            {log.page && <span className="text-[9px] font-black text-slate-700 bg-white/[0.03] px-2 py-0.5 rounded uppercase tracking-wider">{log.page}</span>}
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${cfg.style}`}>
                        {cfg.icon} {log.action}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 animate-fadeInUp">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'bg-[#060d1f] border border-white/5 text-slate-400 hover:bg-[#0a1128] hover:border-white/10'}`}>
                <FiChevronLeft />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ${currentPage === i + 1 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25' : 'bg-[#060d1f] text-slate-500 hover:bg-[#0a1128] border border-white/5'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : 'bg-[#060d1f] border border-white/5 text-slate-400 hover:bg-[#0a1128] hover:border-white/10'}`}>
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeInScale" onClick={() => setSelectedLog(null)}>
            <div onClick={(e) => e.stopPropagation()} className="glass-strong max-w-md w-full rounded-[2rem] p-7 mx-4 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.04]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center"><FiLayers className="text-cyan-400" /></div>
                <h3 className="text-xl font-bold text-white">Log Details</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'User Name', value: selectedLog.userName },
                  { label: 'User ID', value: selectedLog.userId || '-' },
                  { label: 'Action', value: selectedLog.action },
                  { label: 'Date', value: formatDate(selectedLog.date) },
                  { label: 'Page', value: selectedLog.page || '-' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{item.label}</span>
                    <span className="text-sm font-medium text-white">{item.value}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setSelectedLog(null)} className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 active:scale-[0.98] transition-all">
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div style={{ top: contextMenu.y, left: contextMenu.x }} className="fixed z-50 glass-strong rounded-xl shadow-2xl overflow-hidden" onMouseLeave={() => setContextMenu(null)}>
          <button onClick={async () => {
            await axios.delete(`http://localhost:5000/logs/${contextMenu.log.id}`)
            setData((prev) => prev.filter((item) => item.id !== contextMenu.log.id))
            setContextMenu(null)
          }} className="flex items-center gap-2 px-5 py-3 text-red-400 hover:bg-red-500/10 w-full text-sm font-bold transition-all">
            <FiTrash2 /> Delete log
          </button>
        </div>
      )}
    </>
  )
}

export default Logs
