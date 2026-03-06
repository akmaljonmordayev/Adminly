import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { DatePicker, ConfigProvider, theme, Modal, Select, Input } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import 'react-toastify/dist/ReactToastify.css'
import {
  FiSearch, FiPlus, FiClock, FiCheckCircle, FiLoader,
  FiEdit2, FiTrash2, FiUser, FiCalendar,
  FiFilter, FiArrowRight, FiCheck, FiCheckSquare
} from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'

const API_URL = 'http://localhost:5000/tasks'

const STATUS_CONFIG = {
  pending: {
    color: 'amber',
    icon: <FiClock />,
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20'
  },
  'in progress': {
    color: 'cyan',
    icon: <FiLoader className="animate-spin-slow" />,
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20'
  },
  done: {
    color: 'emerald',
    icon: <FiCheckCircle />,
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20'
  },
}

function Tasks() {
  const { isDarkMode } = useTheme()
  const [tasks, setTasks] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  // State for Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    taskName: '',
    employeeName: '',
    deadline: '',
    status: 'pending'
  })

  // Filters State
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(API_URL)
      setTasks(res.data || [])
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/employees')
      setEmployees(res.data || [])
    } catch { }
  }, [])

  useEffect(() => {
    fetchTasks()
    fetchEmployees()
  }, [fetchTasks, fetchEmployees])

  const availableYears = useMemo(() => {
    const years = [...new Set(tasks.map((t) => t.deadline?.substring(0, 4)).filter(Boolean))]
    return years.sort((a, b) => b.localeCompare(a))
  }, [tasks])

  const filteredTasks = useMemo(() => {
    let result = tasks.filter((t) => {
      const matchSearch = (t.taskName || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.employeeName || '').toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || (t.status || '').toLowerCase() === statusFilter
      const matchYear = selectedYear === 'all' || (t.deadline || '').startsWith(selectedYear)
      return matchSearch && matchStatus && matchYear
    })

    return result.sort((a, b) => {
      if (sortBy === 'name-asc') return (a.taskName || '').localeCompare(b.taskName || '')
      if (sortBy === 'name-desc') return (b.taskName || '').localeCompare(a.taskName || '')
      if (sortBy === 'oldest') return dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf()
      if (sortBy === 'newest') return dayjs(b.deadline).valueOf() - dayjs(a.deadline).valueOf()
      return 0
    })
  }, [tasks, search, statusFilter, selectedYear, sortBy])

  const handleOpenCreate = () => {
    setEditingTask(null)
    setFormData({ taskName: '', employeeName: '', deadline: '', status: 'pending' })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (task) => {
    setEditingTask(task)
    setFormData({
      taskName: task.taskName || '',
      employeeName: task.employeeName || '',
      deadline: task.deadline || '',
      status: task.status || 'pending'
    })
    setIsModalOpen(true)
  }

  const handleSubmitPopup = async (e) => {
    if (e) e.preventDefault();

    if (!formData.taskName || !formData.employeeName || !formData.deadline) {
      toast.warning("Barcha maydonlarni to'ldiring")
      return
    }

    try {
      const rawUserString = localStorage.getItem('user');
      let userName = 'Admin';
      if (rawUserString && rawUserString !== 'undefined') {
        try {
          userName = JSON.parse(rawUserString)?.name || 'Admin';
        } catch (e) { }
      }

      if (editingTask) {
        await axios.put(`${API_URL}/${editingTask.id}`, formData)
        toast.success("Vazifa yangilandi")
        await axios.post('http://localhost:5000/logs', {
          userName, action: 'UPDATE', date: new Date().toISOString(), page: 'TASKS'
        })
      } else {
        await axios.post(API_URL, formData)
        toast.success("Yangi vazifa yaratildi")
        await axios.post('http://localhost:5000/logs', {
          userName, action: 'CREATE', date: new Date().toISOString(), page: 'TASKS'
        })
      }
      setIsModalOpen(false)
      fetchTasks()
    } catch (err) {
      console.error('Submission error:', err)
      toast.error('Xatolik yuz berdi')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Haqiqatdan ham o\'chirmoqchimisiz?')) return
    try {
      const res = await axios.get(`${API_URL}/${id}`)
      await axios.post('http://localhost:5000/tasksDeleted', res.data)
      await axios.delete(`${API_URL}/${id}`)
      toast.info("Vazifa arxivlandi")

      const rawUserString = localStorage.getItem('user');
      let userName = 'Admin';
      if (rawUserString && rawUserString !== 'undefined') {
        try {
          userName = JSON.parse(rawUserString)?.name || 'Admin';
        } catch (e) { }
      }

      await axios.post('http://localhost:5000/logs', {
        userName, action: 'DELETE', date: new Date().toISOString(), page: 'TASKS'
      })
      fetchTasks()
    } catch {
      toast.error('O\'chirishda xatolik')
    }
  }

  const quickUpdateStatus = async (id, newStatus) => {
    try {
      const task = tasks.find(t => t.id === id)
      await axios.put(`${API_URL}/${id}`, { ...task, status: newStatus })
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
      toast.success(`${newStatus} holatiga o'tkazildi`)
    } catch {
      toast.error('Xatolik yuz berdi')
    }
  }

  return (
    <ConfigProvider theme={{ algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 overflow-x-hidden">

        {/* Decorative Circles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 p-6 md:p-10 max-w-[1600px] mx-auto">

          {/* Header */}
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <FiCheckSquare className="text-white text-2xl" />
                </div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase">
                  Operation <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Tasks</span>
                </h1>
              </div>
              <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Command Center Workflow</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="glass-strong p-1.5 rounded-2xl flex items-center gap-1 border border-white/5">
                {['all', ...availableYears.slice(0, 3)].map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedYear === year ? 'bg-cyan-500 text-white' : 'text-[var(--text-secondary)] hover:bg-white/5'}`}
                  >
                    {year}
                  </button>
                ))}
              </div>

              <button
                onClick={handleOpenCreate}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-2xl shadow-cyan-500/30 hover:-translate-y-0.5 transition-all"
              >
                <FiPlus size={18} /> New Objective
              </button>
            </div>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard label="Total Force" value={tasks.length} sub="Active Missions" color="blue" icon={<FiCheckSquare />} />
            <StatCard label="Pending" value={tasks.filter(t => (t.status || '').toLowerCase() === 'pending').length} sub="Awaiting Action" color="amber" icon={<FiClock />} />
            <StatCard label="Active Ops" value={tasks.filter(t => (t.status || '').toLowerCase() === 'in progress').length} sub="In Development" color="cyan" icon={<FiLoader className="animate-spin-slow" />} />
            <StatCard label="Resolved" value={tasks.filter(t => (t.status || '').toLowerCase() === 'done').length} sub="Secured Goals" color="emerald" icon={<FiCheckCircle />} />
          </div>

          {/* Table Controls */}
          <div className="glass-strong rounded-[2.5rem] p-6 mb-10 border border-white/5 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative flex-1 group w-full">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="Search Mission Protocol..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-cyan-500/30 transition-all text-sm font-medium"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 md:w-40 bg-[var(--bg-primary)] border border-white/10 rounded-2xl py-4 px-6 outline-none appearance-none cursor-pointer text-[10px] font-black uppercase text-[var(--text-secondary)]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">Active</option>
                  <option value="done">Completed</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 md:w-40 bg-[var(--bg-primary)] border border-white/10 rounded-2xl py-4 px-6 outline-none appearance-none cursor-pointer text-[10px] font-black uppercase text-[var(--text-secondary)]"
                >
                  <option value="newest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="name-asc">A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loader / Grid */}
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Syncing Intelligence...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-24 glass rounded-[3rem] border border-dashed border-white/10 text-center">
              <h3 className="text-xl font-bold text-[var(--text-secondary)]">No Strategic Data</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredTasks.map((task, i) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={() => handleOpenEdit(task)}
                  onDelete={() => handleDelete(task.id)}
                  onStatusChange={(s) => quickUpdateStatus(task.id, s)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create / Edit Modal */}
        <Modal
          title={null}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          centered
          width={600}
          className="premium-task-modal"
          destroyOnClose
        >
          <div className="glass-strong rounded-[2.5rem] border border-white/10 shadow-3xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                  {editingTask ? <FiEdit2 /> : <FiPlus />}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">{editingTask ? 'Update Objective' : 'New Tactical Deployment'}</h3>
                  <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest opacity-60">Operations Protocol v3.0</p>
                </div>
              </div>

              <form onSubmit={handleSubmitPopup} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Task Identification</label>
                  <Input
                    value={formData.taskName}
                    onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                    placeholder="Enter objective name..."
                    className="w-full bg-white/5 border-white/10 rounded-2xl py-3.5 px-5 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Assigned Unit</label>
                    <Select
                      showSearch
                      placeholder="Select lead..."
                      className="w-full h-[48px] premium-select-field"
                      value={formData.employeeName || undefined}
                      onChange={(v) => setFormData({ ...formData, employeeName: v })}
                    >
                      {employees.map(emp => (
                        <Select.Option key={emp.id} value={emp.fullName}>{emp.fullName}</Select.Option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Termination Date</label>
                    <DatePicker
                      className="w-full bg-white/5 border-white/10 rounded-2xl py-3.5 px-5 text-sm"
                      value={formData.deadline ? dayjs(formData.deadline) : null}
                      onChange={(d, ds) => setFormData({ ...formData, deadline: ds })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Current Readiness</label>
                  <div className="flex gap-2">
                    {Object.keys(STATUS_CONFIG).map(s => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setFormData({ ...formData, status: s })}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-tighter border transition-all ${formData.status === s ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/20' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-cyan-500/20 hover:scale-[1.01] transition-all mt-4"
                >
                  {editingTask ? 'Apply Matrix Update' : 'Initialize Objective'}
                </button>
              </form>
            </div>
            {/* Background glow in modal */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full translate-x-12 -translate-y-12" />
          </div>
        </Modal>

        <ToastContainer position="bottom-right" theme="dark" />

        <style dangerouslySetInnerHTML={{
          __html: `
          .premium-task-modal .ant-modal-content { background: transparent !important; box-shadow: none !important; padding: 0 !important; }
          .premium-select-field .ant-select-selector { 
            background: rgba(255,255,255,0.05) !important; 
            border: 1px solid rgba(255,255,255,0.1) !important; 
            border-radius: 1rem !important;
            height: 48px !important;
          }
          .animate-spin-slow { animation: spin 4s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}} />
      </div>
    </ConfigProvider>
  )
}

function StatCard({ label, value, sub, color, icon }) {
  const colors = {
    blue: 'text-blue-400',
    amber: 'text-amber-400',
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
  }
  return (
    <div className="glass-strong rounded-3xl p-6 border border-white/5 relative group hover:scale-[1.02] transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl ${colors[color]}`}>{icon}</div>
        <span className="text-2xl font-black text-white">{value}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{label}</p>
      <p className="text-[8px] font-bold text-[var(--text-secondary)] opacity-30 uppercase mt-1">{sub}</p>
    </div>
  )
}

function TaskItem({ task, onEdit, onDelete, onStatusChange }) {
  const status = (task.status || 'pending').toLowerCase()
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const overdue = status !== 'done' && dayjs(task.deadline).isBefore(dayjs(), 'day')

  return (
    <div className="glass-strong rounded-[2rem] border border-white/5 hover:border-cyan-500/30 transition-all duration-500 flex flex-col p-6 group">
      <div className="flex items-start justify-between mb-6">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${config.bg} ${config.text} ${config.border}`}>
          {config.icon} {status}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button onClick={onEdit} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-cyan-400 hover:bg-white/10"><FiEdit2 size={12} /></button>
          <button onClick={onDelete} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-red-400 hover:bg-white/10"><FiTrash2 size={12} /></button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-black leading-tight text-white group-hover:text-cyan-400 transition-colors uppercase italic truncate">{task.taskName}</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-white/40 text-[11px] font-bold uppercase">
            <FiUser size={13} className="text-cyan-500/50" /> {task.employeeName}
          </div>
          <div className="flex items-center gap-3 text-white/40 text-[11px] font-bold uppercase">
            <FiCalendar size={13} className={overdue ? 'text-red-500/50' : 'text-cyan-500/50'} />
            <span className={overdue ? 'text-red-400' : ''}>{task.deadline}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
        <p className="text-[9px] font-black text-white/10 uppercase tracking-widest">Protocol 01</p>
        {status !== 'done' && (
          <button
            onClick={() => onStatusChange(status === 'pending' ? 'in progress' : 'done')}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-500 hover:text-white transition-all"
          >
            {status === 'pending' ? 'Start' : 'Finish'} <FiArrowRight size={10} />
          </button>
        )}
      </div>
    </div>
  )
}

export default Tasks
