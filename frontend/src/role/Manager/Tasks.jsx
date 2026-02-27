import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { DatePicker, ConfigProvider, theme } from 'antd'
import { FaMagnifyingGlass, FaPlus } from 'react-icons/fa6'
import axios from 'axios'
import dayjs from 'dayjs'
import {
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineStatusOnline,
  HiOutlineTrash,
  HiOutlinePencilAlt,
  HiOutlineSave,
  HiOutlineFilter,
} from 'react-icons/hi'

const API_URL = 'http://localhost:5000/tasks'

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

  const filteredTasks = [...tasks]
    .filter((task) =>
      task.taskName.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === 'A-Z') return a.taskName.localeCompare(b.taskName)
      if (sortOrder === 'Z-A') return b.taskName.localeCompare(a.taskName)
      if (sortOrder === 'DATE-ASC')
        return dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf()
      if (sortOrder === 'DATE-DESC')
        return dayjs(b.deadline).valueOf() - dayjs(a.deadline).valueOf()
      return 0
    })

  const fetchTasks = async () => {
    const res = await fetch(API_URL)
    const data = await res.json()
    setTasks(data)
  }

  const fetchEmployees = async () => {
    const res = await fetch('http://localhost:5000/employees')
    const data = await res.json()
    setEmployees(data)
  }

  useEffect(() => {
    fetchTasks()
    fetchEmployees()
  }, [])

  const fullnames = employees.map((e) => e.fullName)

  const addTask = async () => {
    if (!taskName || !employeeName || !deadline) {
      toast.error('Iltimos barcha maydonlarni to‘ldiring')
      return
    }
    let user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' }
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskName,
        employeeName,
        deadline,
        status: 'pending',
      }),
    })
    toast.success('Task muvaffaqiyatli qo‘shildi')
    await axios.post('http://localhost:5000/logs', {
      userName: user.name,
      action: 'CREATE',
      date: new Date().toISOString(),
      page: 'TASKS',
    })
    setTaskName('')
    setEmployeeName('')
    setDeadline('')
    fetchTasks()
  }

  const deleteTask = async (id) => {
    let user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' }
    let res = await axios.get(`http://localhost:5000/tasks/${id}`)
    await axios.post(`http://localhost:5000/tasksDeleted`, res.data)
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    toast.info('Task o‘chirildi va arxivlandi')
    await axios.post('http://localhost:5000/logs', {
      userName: user.name,
      action: 'DELETE',
      date: new Date().toISOString(),
      page: 'TASKS',
    })
    fetchTasks()
  }

  const updateStatus = async (id, status) => {
    const currentTask = tasks.find((t) => t.id === id)
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...currentTask, status }),
    })
    fetchTasks()
  }

  const saveEdit = async (id) => {
    const currentTask = tasks.find((t) => t.id === id)
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...currentTask,
        taskName: editTaskName,
        employeeName: editEmployeeName,
        deadline: editDeadline,
      }),
    })
    toast.success('O‘zgarishlar saqlandi')
    setEditingId(null)
    fetchTasks()
  }

  const statusColors = {
    pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    'in progress': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    done: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  }

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="min-h-screen bg-[#020617] text-slate-200 p-4 lg:p-10 font-sans selection:bg-cyan-500/30">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h1 className="text-6xl font-black tracking-tighter text-white">
                TASKS
              </h1>
            </div>
            <div className="bg-slate-900/50 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
              <span className="text-cyan-400 font-mono text-sm">
                Active: {tasks.length} tasks
              </span>
            </div>
          </header>

          {/* Creation Panel */}
          <div className="group backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] mb-12 shadow-2xl transition-all hover:border-cyan-500/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase ml-1">
                  Title
                </p>
                <input
                  placeholder="What needs to be done?"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-2xl px-5 py-3.5 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase ml-1">
                  Assignee
                </p>
                <select
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-2xl px-5 py-3.5 focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option disabled value="">
                    Select Employee
                  </option>
                  {fullnames.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase ml-1">
                  Deadline
                </p>
                <DatePicker
                  className="w-full h-[53px] bg-black/40 border-slate-800 rounded-2xl hover:border-cyan-500"
                  onChange={(d, ds) => setDeadline(ds)}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={addTask}
                  className="w-full h-[53px] bg-cyan-500 hover:bg-cyan-400 text-black rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                >
                  <FaPlus size={18} /> CREATE TASK
                </button>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-10">
            <div className="relative flex-1 group">
              <FaMagnifyingGlass className="absolute left-5 z-20 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-4 pl-14 pr-6 backdrop-blur-xl focus:bg-slate-900/90 outline-none transition-all"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a specific task..."
              />
            </div>
            <div className="flex gap-4">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-slate-900/60 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500/50 backdrop-blur-xl cursor-pointer"
              >
                <option className="bg-[#080D1F]" value="">
                  Name Sorting
                </option>
                <option className="bg-[#080D1F]" value="A-Z">
                  A → Z
                </option>
                <option className="bg-[#080D1F]" value="Z-A">
                  Z → A
                </option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-slate-900/60 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500/50 backdrop-blur-xl cursor-pointer"
              >
                <option className="bg-[#080D1F]" value="">
                  Date Sorting
                </option>
                <option className="bg-[#080D1F]" value="DATE-ASC">
                  Oldest
                </option>
                <option className="bg-[#080D1F]" value="DATE-DESC">
                  Newest
                </option>
              </select>
            </div>
          </div>

          <ToastContainer
            position="bottom-right"
            autoClose={2500}
            theme="dark"
          />

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredTasks.length === 0 ? (
              <div className="col-span-full text-center py-32 bg-slate-900/20 rounded-[3rem] border border-dashed border-white/10">
                <HiOutlineClipboardList className="mx-auto text-6xl text-slate-700 mb-4" />
                <h2 className="text-xl font-medium text-slate-500 tracking-widest">
                  NO TASKS IN QUEUE
                </h2>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="group relative bg-slate-900/40 border border-white/5 p-7 rounded-[2.5rem] hover:bg-slate-900/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(6,182,212,0.1)]"
                >
                  {/* Status Badge */}
                  <div
                    className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold border ${
                      statusColors[task.status]
                    }`}
                  >
                    {task.status.toUpperCase()}
                  </div>

                  {editingId === task.id ? (
                    <div className="space-y-4 py-4">
                      <input
                        value={editTaskName}
                        onChange={(e) => setEditTaskName(e.target.value)}
                        className="w-full bg-black/60 border border-cyan-500/30 rounded-xl px-4 py-2 text-sm outline-none"
                      />
                      <select
                        value={editEmployeeName}
                        onChange={(e) => setEditEmployeeName(e.target.value)}
                        className="w-full bg-black/60 border border-cyan-500/30 rounded-xl px-4 py-2 text-sm outline-none"
                      >
                        {fullnames.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      <DatePicker
                        className="w-full"
                        value={editDeadline ? dayjs(editDeadline) : null}
                        onChange={(d, ds) => setEditDeadline(ds)}
                      />
                    </div>
                  ) : (
                    <div className="min-h-[140px]">
                      <h3 className="text-2xl font-bold text-white mb-6 pr-16 group-hover:text-cyan-400 transition-colors">
                        {task.taskName}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-400">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                            <HiOutlineUser className="text-cyan-400" />
                          </div>
                          <span className="text-sm font-medium">
                            {task.employeeName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                            <HiOutlineCalendar className="text-cyan-400" />
                          </div>
                          <span className="text-sm font-medium">
                            {task.deadline}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 mt-8 pt-6 border-t border-white/5">
                    <select
                      value={task.status}
                      onChange={(e) => updateStatus(task.id, e.target.value)}
                      className="flex-1 bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs font-bold outline-none hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <option className="bg-[#080D1F]" value="pending">
                        PENDING
                      </option>
                      <option className="bg-[#080D1F]" value="in progress">
                        IN PROGRESS
                      </option>
                      <option className="bg-[#080D1F]" value="done">
                        DONE
                      </option>
                    </select>

                    <div className="flex gap-2">
                      {editingId === task.id ? (
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all"
                        >
                          <HiOutlineSave size={20} />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(task.id)
                            setEditTaskName(task.taskName)
                            setEditEmployeeName(task.employeeName)
                            setEditDeadline(task.deadline)
                          }}
                          className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                        >
                          <HiOutlinePencilAlt size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="w-10 h-10 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                      >
                        <HiOutlineTrash size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default Tasks
