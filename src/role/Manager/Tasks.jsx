import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { DatePicker, ConfigProvider, theme } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import 'react-toastify/dist/ReactToastify.css'
import { HiOutlineClipboardList, HiOutlineUser, HiOutlineCalendar, HiOutlineTrash, HiOutlinePencilAlt, HiOutlineSave, HiOutlineX } from 'react-icons/hi'
import { FiSearch, FiChevronDown, FiPlus, FiClock, FiCheckCircle, FiLoader } from 'react-icons/fi'

const API_URL = 'http://localhost:5000/tasks'

const STATUS_CONFIG = {
  pending: { dot: 'bg-amber-400 shadow-amber-400/50', badge: 'text-amber-300 border-amber-400/20 bg-gradient-to-r from-amber-500/10 to-amber-600/5' },
  'in progress': { dot: 'bg-cyan-400 shadow-cyan-400/50', badge: 'text-cyan-300 border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-cyan-600/5' },
  done: { dot: 'bg-emerald-400 shadow-emerald-400/50', badge: 'text-emerald-300 border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5' },
}

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [employees, setEmployees] = useState([])
  const [taskName, setTaskName] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [deadline, setDeadline] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTaskName, setEditTaskName] = useState('')
  const [editEmployeeName, setEditEmployeeName] = useState('')
  const [editDeadline, setEditDeadline] = useState('')
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' }

  const fetchTasks = useCallback(async () => { try { const res = await axios.get(API_URL); setTasks(res.data) } catch { toast.error('Failed to load tasks') } }, [])
  const fetchEmployees = useCallback(async () => { try { const res = await axios.get('http://localhost:5000/employees'); setEmployees(res.data) } catch { } }, [])
  useEffect(() => { fetchTasks(); fetchEmployees() }, [fetchTasks, fetchEmployees])

  const fullnames = useMemo(() => employees.map((e) => e.fullName), [employees])
  const availableYears = useMemo(() => [...new Set(tasks.map((t) => t.deadline?.substring(0, 4)).filter(Boolean))].sort((a, b) => b.localeCompare(a)), [tasks])

  const filteredTasks = useMemo(() => {
    let f = tasks.filter((t) => {
      const s = t.taskName?.toLowerCase().includes(search.toLowerCase()) || t.employeeName?.toLowerCase().includes(search.toLowerCase())
      const st = statusFilter === 'all' || t.status?.toLowerCase() === statusFilter
      const y = selectedYear === 'all' || t.deadline?.startsWith(selectedYear)
      return s && st && y
    })
    return f.sort((a, b) => {
      if (sortOrder === 'A-Z') return (a.taskName || '').localeCompare(b.taskName || '')
      if (sortOrder === 'Z-A') return (b.taskName || '').localeCompare(a.taskName || '')
      if (sortOrder === 'DATE-ASC') return dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf()
      if (sortOrder === 'DATE-DESC') return dayjs(b.deadline).valueOf() - dayjs(a.deadline).valueOf()
      return 0
    })
  }, [tasks, search, statusFilter, selectedYear, sortOrder])

  const statusCounts = useMemo(() => {
    const yf = selectedYear === 'all' ? tasks : tasks.filter((t) => t.deadline?.startsWith(selectedYear))
    return { all: yf.length, pending: yf.filter((t) => t.status?.toLowerCase() === 'pending').length, 'in progress': yf.filter((t) => t.status?.toLowerCase() === 'in progress').length, done: yf.filter((t) => t.status?.toLowerCase() === 'done').length }
  }, [tasks, selectedYear])

  const addTask = async () => {
    if (!taskName || !employeeName || !deadline) { toast.error("Barcha maydonlarni to'ldiring"); return }
    try {
      await axios.post(API_URL, { taskName, employeeName, deadline, status: 'pending' })
      toast.success("Task qo'shildi")
      await axios.post('http://localhost:5000/logs', { userName: user.name, action: 'CREATE', date: new Date().toISOString(), page: 'TASKS' })
      setTaskName(''); setEmployeeName(''); setDeadline(''); setShowForm(false); fetchTasks()
    } catch { toast.error('Failed') }
  }

  const deleteTask = async (id) => {
    if (!window.confirm('Delete?')) return
    try {
      const res = await axios.get(`${API_URL}/${id}`)
      await axios.post('http://localhost:5000/tasksDeleted', res.data)
      await axios.delete(`${API_URL}/${id}`)
      toast.info("O'chirildi va arxivlandi")
      await axios.post('http://localhost:5000/logs', { userName: user.name, action: 'DELETE', date: new Date().toISOString(), page: 'TASKS' })
      fetchTasks()
    } catch { toast.error('Delete failed') }
  }

  const updateStatus = async (id, status) => {
    try { const t = tasks.find((t) => t.id === id); await axios.put(`${API_URL}/${id}`, { ...t, status }); setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t))) } catch { toast.error('Error') }
  }

  const saveEdit = async (id) => {
    try { const t = tasks.find((t) => t.id === id); await axios.put(`${API_URL}/${id}`, { ...t, taskName: editTaskName, employeeName: editEmployeeName, deadline: editDeadline }); toast.success('Saqlandi'); setEditingId(null); fetchTasks() } catch { toast.error('Error') }
  }

  const isOverdue = (dl, st) => st !== 'done' && dayjs(dl).isBefore(dayjs(), 'day')

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full animate-float" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 p-4 md:p-8 max-w-[1500px] mx-auto">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 animate-fadeInUp">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">TASKS</span>
              </h1>
              <p className="text-slate-600 text-xs font-medium mt-1.5 tracking-wider uppercase">Create, assign & track team tasks</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 glass rounded-2xl p-1.5">
                <button onClick={() => setSelectedYear('all')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${selectedYear === 'all' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>All</button>
                {availableYears.map((y) => (
                  <button key={y} onClick={() => setSelectedYear(y)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${selectedYear === y ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>{y}</button>
                ))}
              </div>
              <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 hover:shadow-xl hover:shadow-cyan-500/30">
                <FiPlus size={16} /><span className="hidden md:inline">New Task</span>
              </button>
            </div>
          </header>

          {/* Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fadeInUp stagger-1 opacity-0">
            {[
              { key: 'all', label: 'Total', icon: <HiOutlineClipboardList />, gradient: 'from-cyan-500/15 to-blue-500/5', iconColor: 'text-cyan-400', borderColor: 'border-cyan-500/20 hover:border-cyan-400/40' },
              { key: 'pending', label: 'Pending', icon: <FiClock />, gradient: 'from-amber-500/15 to-orange-500/5', iconColor: 'text-amber-400', borderColor: 'border-amber-500/20 hover:border-amber-400/40' },
              { key: 'in progress', label: 'In Progress', icon: <FiLoader />, gradient: 'from-cyan-500/15 to-indigo-500/5', iconColor: 'text-cyan-400', borderColor: 'border-cyan-500/20 hover:border-cyan-400/40' },
              { key: 'done', label: 'Completed', icon: <FiCheckCircle />, gradient: 'from-emerald-500/15 to-green-500/5', iconColor: 'text-emerald-400', borderColor: 'border-emerald-500/20 hover:border-emerald-400/40' },
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

          {/* Create Form */}
          {showForm && (
            <div className="glass-strong rounded-[2rem] p-6 mb-10 animate-fadeInScale">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-cyan-500 tracking-[0.2em] uppercase ml-1">Task Title</p>
                  <input placeholder="What needs to be done?" value={taskName} onChange={(e) => setTaskName(e.target.value)}
                    className="w-full bg-[#060d1f] border border-white/[0.06] rounded-xl px-4 py-3 focus:border-cyan-500/40 outline-none transition-all placeholder:text-slate-700 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-cyan-500 tracking-[0.2em] uppercase ml-1">Assignee</p>
                  <select value={employeeName} onChange={(e) => setEmployeeName(e.target.value)}
                    className="w-full bg-[#060d1f] border border-white/[0.06] rounded-xl px-4 py-3 focus:border-cyan-500/40 outline-none transition-all appearance-none cursor-pointer text-sm">
                    <option disabled value="">Select Employee</option>
                    {fullnames.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-cyan-500 tracking-[0.2em] uppercase ml-1">Deadline</p>
                  <DatePicker className="w-full h-[46px] bg-[#060d1f] border-white/[0.06] rounded-xl hover:border-cyan-500/40" onChange={(d, ds) => setDeadline(ds)} />
                </div>
                <div className="flex items-end">
                  <button onClick={addTask} className="w-full h-[46px] bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 text-sm">
                    <FiPlus size={14} /> CREATE
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8 animate-fadeInUp stagger-2 opacity-0">
            <div className="md:col-span-6 relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
              <input className="w-full glass rounded-2xl py-3.5 pl-12 pr-6 outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-700 text-sm" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." />
            </div>
            <div className="md:col-span-3 relative">
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full glass rounded-2xl py-3.5 px-5 outline-none focus:border-cyan-500/40 cursor-pointer appearance-none text-slate-400 text-sm">
                <option className="bg-[#060d1f]" value="">Default</option><option className="bg-[#060d1f]" value="A-Z">A → Z</option><option className="bg-[#060d1f]" value="Z-A">Z → A</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
            </div>
            <div className="md:col-span-3 relative">
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full glass rounded-2xl py-3.5 px-5 outline-none focus:border-cyan-500/40 cursor-pointer appearance-none text-slate-400 text-sm">
                <option className="bg-[#060d1f]" value="">Date</option><option className="bg-[#060d1f]" value="DATE-ASC">Oldest</option><option className="bg-[#060d1f]" value="DATE-DESC">Newest</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
            </div>
          </div>

          {/* Task Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTasks.length === 0 ? (
              <div className="col-span-full text-center py-28 bg-[#060d1f] rounded-[2rem] border border-dashed border-white/[0.06] animate-fadeInScale">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center"><HiOutlineClipboardList className="text-2xl text-slate-700" /></div>
                <p className="text-slate-600 font-bold text-lg">No tasks found</p>
                <p className="text-slate-700 text-sm mt-1">Create a new task or adjust filters</p>
              </div>
            ) : (
              filteredTasks.map((task, i) => {
                const status = task.status?.toLowerCase() || 'pending'
                const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
                const overdue = isOverdue(task.deadline, status)

                return (
                  <div key={task.id} className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 flex flex-col hover:-translate-y-1 hover:shadow-xl animate-fadeInUp opacity-0 ${overdue ? 'border-red-500/20' : 'border-white/[0.04] hover:border-white/10'}`} style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] to-[#060d1f] group-hover:from-[#0d1630] group-hover:to-[#0a1128] transition-all duration-500" />
                    <div className="noise absolute inset-0" />
                    <div className="relative p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${config.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />{status}
                        </span>
                        {overdue && <span className="text-[10px] font-black text-red-400 bg-red-400/10 px-2.5 py-0.5 rounded-full border border-red-400/20">OVERDUE</span>}
                      </div>

                      {editingId === task.id ? (
                        <div className="space-y-3 flex-1">
                          <input value={editTaskName} onChange={(e) => setEditTaskName(e.target.value)} className="w-full bg-[#060d1f] border border-cyan-500/20 rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-500/40" />
                          <select value={editEmployeeName} onChange={(e) => setEditEmployeeName(e.target.value)} className="w-full bg-[#060d1f] border border-cyan-500/20 rounded-xl px-3 py-2 text-sm outline-none">{fullnames.map((n) => <option key={n} value={n}>{n}</option>)}</select>
                          <DatePicker className="w-full" value={editDeadline ? dayjs(editDeadline) : null} onChange={(d, ds) => setEditDeadline(ds)} />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors leading-tight">{task.taskName}</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2.5 text-slate-500">
                              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0"><HiOutlineUser className="text-cyan-400/70 text-sm" /></div>
                              <span className="text-sm font-medium truncate">{task.employeeName}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-500">
                              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0"><HiOutlineCalendar className={`text-sm ${overdue ? 'text-red-400' : 'text-cyan-400/70'}`} /></div>
                              <span className={`text-sm font-medium ${overdue ? 'text-red-400' : ''}`}>{task.deadline}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-5 pt-4 border-t border-white/[0.04]">
                        <select value={task.status} onChange={(e) => updateStatus(task.id, e.target.value)} className="flex-1 bg-white/[0.03] border border-white/[0.04] rounded-xl px-3 py-2 text-[10px] font-black uppercase outline-none hover:bg-white/[0.06] transition-all cursor-pointer">
                          <option className="bg-[#060d1f]" value="pending">PENDING</option><option className="bg-[#060d1f]" value="in progress">IN PROGRESS</option><option className="bg-[#060d1f]" value="done">DONE</option>
                        </select>
                        <div className="flex gap-1.5">
                          {editingId === task.id ? (
                            <><button onClick={() => saveEdit(task.id)} className="w-9 h-9 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all"><HiOutlineSave size={14} /></button>
                              <button onClick={() => setEditingId(null)} className="w-9 h-9 bg-white/5 text-slate-500 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all"><HiOutlineX size={14} /></button></>
                          ) : (
                            <button onClick={() => { setEditingId(task.id); setEditTaskName(task.taskName); setEditEmployeeName(task.employeeName); setEditDeadline(task.deadline) }} className="w-9 h-9 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"><HiOutlinePencilAlt size={14} /></button>
                          )}
                          <button onClick={() => deleteTask(task.id)} className="w-9 h-9 bg-red-500/[0.06] text-red-400/70 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><HiOutlineTrash size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
        <ToastContainer position="bottom-right" autoClose={2500} theme="dark" toastClassName="!bg-[#0a1128] !border !border-white/10 !rounded-2xl !shadow-2xl" />
      </div>
    </ConfigProvider>
  )
}

export default Tasks
