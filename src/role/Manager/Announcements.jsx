import { useTheme } from '../../context/ThemeContext';
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import axios from 'axios'
import { Modal, ConfigProvider, theme } from 'antd'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { HiOutlineCalendarDays, HiOutlineTrash, HiOutlinePencilSquare, HiXMark, HiOutlineMegaphone, HiPlus } from 'react-icons/hi2'
import { FiSearch, FiChevronDown, FiAlertCircle } from 'react-icons/fi'

const Announcements = () => {
  const API = 'http://localhost:5000/announcements'
  const DELETED_API = 'http://localhost:5000/announcementsDeleted'

    const { isDarkMode } = useTheme();
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [newText, setNewText] = useState('')
  const [date, setDate] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnn, setEditingAnn] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [selectedYear, setSelectedYear] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try { const res = await axios.get(API); setAnnouncements(res.data) }
    catch (e) { toast.error('Failed to load announcements') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const availableYears = useMemo(() => {
    const years = [...new Set(announcements.map((a) => {
      if (!a.date) return null
      const d = new Date(a.date)
      return isNaN(d.getTime()) ? a.date.substring(0, 4) : String(d.getFullYear())
    }).filter(Boolean))]
    return years.sort((a, b) => b.localeCompare(a))
  }, [announcements])

  const processedData = useMemo(() => {
    let filtered = announcements.filter((a) => {
      const ms = a.title?.toLowerCase().includes(search.toLowerCase()) || a.text?.toLowerCase().includes(search.toLowerCase())
      let my = selectedYear === 'all'
      if (!my && a.date) {
        const d = new Date(a.date)
        const ys = isNaN(d.getTime()) ? a.date.substring(0, 4) : String(d.getFullYear())
        my = ys === selectedYear
      }
      return ms && my
    })
    return filtered.sort((a, b) => {
      if (sort === 'newest') return new Date(b.date || 0) - new Date(a.date || 0)
      if (sort === 'oldest') return new Date(a.date || 0) - new Date(b.date || 0)
      if (sort === 'a-z') return (a.title || '').localeCompare(b.title || '')
      return (b.title || '').localeCompare(a.title || '')
    })
  }, [announcements, search, selectedYear, sort])

  const addAnnouncement = async () => {
    if (!newTitle || !newText) { toast.error('Please fill in all fields'); return }
    try {
      const res = await axios.post(API, { title: newTitle, text: newText, date: date || new Date().toISOString(), status: 'Active' })
      setAnnouncements([...announcements, res.data])
      toast.success('Published!')
      await axios.post('http://localhost:5000/logs', { userName: user.name, action: 'CREATE', date: new Date().toISOString(), page: 'ANNOUNCEMENTS' })
      setNewTitle(''); setNewText(''); setDate(''); setShowForm(false)
    } catch { toast.error('Error') }
  }

  const deleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return
    const item = announcements.find((a) => a.id === id)
    if (!item) return
    try {
      await axios.post(DELETED_API, item)
      await axios.delete(`${API}/${id}`)
      setAnnouncements(announcements.filter((a) => a.id !== id))
      toast.success('Archived & deleted')
      await axios.post('http://localhost:5000/logs', { userName: user.name, action: 'DELETE', date: new Date().toISOString(), page: 'ANNOUNCEMENTS' })
    } catch { toast.error('Delete failed') }
  }

  const openEditModal = (a) => { setEditingAnn(a); setNewTitle(a.title); setNewText(a.text); setDate(a.date); setIsModalOpen(true) }

  const updateAnnouncement = async () => {
    if (!newTitle || !newText) { toast.error('Fill all fields'); return }
    const updated = { ...editingAnn, title: newTitle, text: newText, date }
    try {
      await axios.put(`${API}/${editingAnn.id}`, updated)
      setAnnouncements(announcements.map((a) => (a.id === editingAnn.id ? updated : a)))
      setIsModalOpen(false)
      toast.success('Updated!')
      await axios.post('http://localhost:5000/logs', { userName: user.name, action: 'UPDATE', date: new Date().toISOString(), page: 'ANNOUNCEMENTS' })
    } catch { toast.error('Error') }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No date'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorBgElevated: '#0a1128', colorText: '#f8fafc', borderRadius: 16, colorPrimary: '#06b6d4' } }}>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-15%] right-[-10%] w-[45%] h-[45%] bg-blue-900/8 blur-[150px] rounded-full animate-float" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/8 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2.5s' }} />
        </div>

        <div className="relative z-10 p-4 md:p-8 max-w-[1500px] mx-auto">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 animate-fadeInUp">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">ANNOUNCEMENTS</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-xs font-medium mt-1.5 tracking-wider uppercase">Publish & manage company updates</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 glass rounded-2xl p-1.5">
                <button onClick={() => setSelectedYear('all')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${selectedYear === 'all' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-[var(--text-primary)] shadow-lg shadow-cyan-500/25' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-cyan-500/5'}`}>All</button>
                {availableYears.map((y) => (
                  <button key={y} onClick={() => setSelectedYear(y)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${selectedYear === y ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-[var(--text-primary)] shadow-lg shadow-cyan-500/25' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-cyan-500/5'}`}>{y}</button>
                ))}
              </div>
              <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-[var(--text-primary)] rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95">
                <HiPlus size={16} /><span className="hidden md:inline">New</span>
              </button>
            </div>
          </header>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-10 p-4 bg-[var(--bg-secondary)] rounded-2xl border border-cyan-500/10 animate-fadeInUp stagger-1 opacity-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/10 flex items-center justify-center"><HiOutlineMegaphone className="text-cyan-400 text-sm" /></div>
              <span className="text-sm font-black text-[var(--text-primary)]">{processedData.length}</span>
              <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">announcements</span>
            </div>
            <div className="h-5 w-px bg-white/[0.06]" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30" />
              <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">{announcements.filter((a) => a.status === 'Active').length} active</span>
            </div>
          </div>

          {/* Create */}
          {showForm && (
            <div className="glass-strong rounded-[2rem] p-6 mb-10 animate-fadeInScale">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-3 space-y-1.5">
                  <p className="text-[9px] font-black text-cyan-500 tracking-[0.2em] uppercase ml-1">Title</p>
                  <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Title..."
                    className="w-full bg-[var(--bg-secondary)] border border-cyan-500/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/40 transition-all placeholder:text-[var(--text-secondary)] text-sm" />
                </div>
                <div className="lg:col-span-5 space-y-1.5">
                  <p className="text-[9px] font-black text-cyan-500 tracking-[0.2em] uppercase ml-1">Description</p>
                  <input value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="What's the announcement about?"
                    className="w-full bg-[var(--bg-secondary)] border border-cyan-500/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/40 transition-all placeholder:text-[var(--text-secondary)] text-sm" />
                </div>
                <div className="lg:col-span-2 space-y-1.5">
                  <p className="text-[9px] font-black text-cyan-500 tracking-[0.2em] uppercase ml-1">Date</p>
                  <input type="date" value={date ? date.substring(0, 10) : ''} onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[var(--bg-secondary)] border border-cyan-500/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/40 transition-all text-sm text-[var(--text-secondary)]" />
                </div>
                <div className="lg:col-span-2 flex items-end">
                  <button onClick={addAnnouncement} className="w-full h-[46px] bg-gradient-to-r from-cyan-500 to-blue-500 text-[var(--text-primary)] rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 text-sm">
                    <HiPlus /> Publish
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8 animate-fadeInUp stagger-2 opacity-0">
            <div className="md:col-span-8 relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-cyan-400 transition-colors" />
              <input type="text" placeholder="Search announcements..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full glass rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-cyan-500/40 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] text-sm" />
            </div>
            <div className="md:col-span-4 relative">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full glass rounded-2xl py-3.5 px-5 appearance-none focus:outline-none focus:border-cyan-500/40 cursor-pointer text-[var(--text-secondary)] text-sm">
                <option className="bg-[var(--bg-secondary)]" value="newest">Newest First</option><option className="bg-[var(--bg-secondary)]" value="oldest">Oldest First</option>
                <option className="bg-[var(--bg-secondary)]" value="a-z">Title: A-Z</option><option className="bg-[var(--bg-secondary)]" value="z-a">Title: Z-A</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-28 animate-fadeInScale">
              <div className="w-14 h-14 border-2 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin mx-auto mb-5" />
              <p className="text-cyan-500/60 font-bold uppercase tracking-[0.3em] text-xs">Loading</p>
            </div>
          ) : processedData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {processedData.map((a, i) => (
                <div key={a.id} className="group relative overflow-hidden rounded-2xl border border-cyan-500/10 hover:border-cyan-500/10 transition-all duration-500 flex flex-col hover:-translate-y-1 hover:shadow-xl animate-fadeInUp opacity-0" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] group-hover:from-[#0d1630] group-hover:to-[#0a1128] transition-all duration-500" />
                  <div className="noise absolute inset-0" />
                  <div className="relative p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">{a.status || 'Active'}</span>
                      </div>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={() => openEditModal(a)} className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 hover:text-[var(--text-primary)] transition-all"><HiOutlinePencilSquare size={13} /></button>
                        <button onClick={() => deleteAnnouncement(a.id)} className="w-8 h-8 bg-red-500/[0.06] text-red-400/70 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-[var(--text-primary)] transition-all"><HiOutlineTrash size={13} /></button>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-cyan-400 transition-colors leading-tight">{a.title}</h3>
                    <p className="text-[var(--text-secondary)] text-sm flex-grow leading-relaxed line-clamp-3 mb-4">{a.text}</p>
                    <div className="flex items-center gap-2 pt-4 border-t border-cyan-500/10 text-xs text-[var(--text-secondary)]">
                      <HiOutlineCalendarDays className="text-cyan-500/50" /><span className="font-medium">{formatDate(a.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-28 text-center border border-dashed border-cyan-500/10 rounded-[2rem] bg-[var(--bg-secondary)] animate-fadeInScale">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/[0.02] border border-cyan-500/10 flex items-center justify-center"><FiAlertCircle className="text-2xl text-[var(--text-secondary)]" /></div>
              <p className="text-[var(--text-secondary)] font-bold text-lg">No announcements</p>
              <p className="text-[var(--text-secondary)] text-sm mt-1">Publish one or adjust filters</p>
            </div>
          )}
        </div>

        <Modal open={isModalOpen} onOk={updateAnnouncement} onCancel={() => setIsModalOpen(false)} centered closeIcon={<HiXMark />} okText="Save Changes"
          okButtonProps={{ className: '!bg-gradient-to-r !from-cyan-500 !to-blue-500 !border-none !text-[var(--text-primary)] !font-bold !rounded-xl !h-10 !shadow-lg !shadow-cyan-500/20' }}
          cancelButtonProps={{ className: '!border-cyan-500/10 !text-[var(--text-secondary)] !rounded-xl !h-10' }}>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Edit Announcement</h3>
          <div className="space-y-3">
            <div><p className="text-[9px] font-black text-cyan-500 tracking-[0.2em] uppercase mb-1.5">Title</p><input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full p-3 bg-[var(--bg-secondary)] border border-cyan-500/10 rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-500/40" /></div>
            <div><p className="text-[9px] font-black text-cyan-500 tracking-[0.2em] uppercase mb-1.5">Description</p><textarea value={newText} onChange={(e) => setNewText(e.target.value)} rows={4} className="w-full p-3 bg-[var(--bg-secondary)] border border-cyan-500/10 rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-500/40 resize-none" /></div>
          </div>
        </Modal>

        <ToastContainer position="bottom-right" autoClose={2500} theme="dark" toastClassName="!bg-[var(--bg-secondary)] !border !border-cyan-500/10 !rounded-2xl !shadow-2xl" />
      </div>
    </ConfigProvider>
  )
}

export default Announcements
