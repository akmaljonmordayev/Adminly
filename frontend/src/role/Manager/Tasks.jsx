import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { DatePicker } from 'antd'
import {
  FaMagnifyingGlass,
  FaPlus,
  FaTrashCan,
  FaPenToSquare,
  FaCheck,
} from 'react-icons/fa6'
import axios from 'axios'
import dayjs from 'dayjs'
import {
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineBadgeCheck,
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
      toast.error('Please fill all fields')
      return
    }
    let user = JSON.parse(localStorage.getItem('user'))
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
    toast.success('Task successfully added')
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
    let user = JSON.parse(localStorage.getItem('user'))
    let res = await axios.get(`http://localhost:5000/tasks/${id}`)
    await axios.post(`http://localhost:5000/tasksDeleted`, res.data)
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    toast.error('Task deleted and archived')
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
    toast.success('Task updated')
    let user = JSON.parse(localStorage.getItem('user'))
    await axios.post('http://localhost:5000/logs', {
      userName: user.name,
      action: 'UPDATE',
      date: new Date().toISOString(),
      page: 'TASKS',
    })
    setEditingId(null)
    fetchTasks()
  }

  const statusStyles = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'in progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    done: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  }

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8 text-slate-200">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="w-2 h-10 bg-cyan-500 rounded-full inline-block"></span>
              Tasks
            </h1>
          </div>
          <div className="flex gap-2">
            <div className="bg-[#0f172a] px-4 py-2 rounded-2xl border border-white/5 text-center">
              <p className="text-xs text-slate-500 uppercase font-bold">
                Total Tasks
              </p>
              <p className="text-xl font-black text-cyan-400">{tasks.length}</p>
            </div>
          </div>
        </div>

        {/* CREATE TASK FORM */}
        <div className="bg-[#0f172a]/50 backdrop-blur-xl p-1 rounded-[2.5rem] border border-white/5 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4">
            <input
              placeholder="Task Title..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="px-5 py-4 rounded-2xl bg-[#020617] border border-slate-800 focus:border-cyan-500/50 outline-none transition-all"
            />
            <select
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="px-5 py-4 rounded-2xl bg-[#020617] border border-slate-800 focus:border-cyan-500/50 outline-none transition-all appearance-none"
            >
              <option selected disabled value="">
                Assign Employee
              </option>
              {fullnames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <DatePicker
              className="bg-[#020617] border-slate-800 rounded-2xl text-white hover:border-cyan-500 h-full"
              onChange={(d, ds) => setDeadline(ds)}
            />
            <button
              onClick={addTask}
              className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
            >
              <FaPlus /> Create Task
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="relative flex-1 w-full">
            <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="w-full bg-[#0f172a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by task title..."
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-[#0f172a] border border-white/5 rounded-2xl px-4 py-4 outline-none text-sm"
            >
              <option selected disabled value="">
                Sort Alphabet
              </option>
              <option value="A-Z">Name: A-Z</option>
              <option value="Z-A">Name: Z-A</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-[#0f172a] border border-white/5 rounded-2xl px-4 py-4 outline-none text-sm"
            >
              <option value="">Sort Date</option>
              <option value="DATE-ASC">Oldest First</option>
              <option value="DATE-DESC">Newest First</option>
            </select>
          </div>
        </div>

        <ToastContainer position="top-right" theme="dark" />

        {/* TASK CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <HiOutlineClipboardList className="mx-auto text-6xl text-slate-800 mb-4" />
              <h2 className="text-xl text-slate-500 font-medium">
                No tasks found in your workspace
              </h2>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group bg-[#0f172a] border border-white/5 p-6 rounded-[2rem] hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 shadow-xl"
              >
                {editingId === task.id ? (
                  <div className="space-y-3 mb-4">
                    <input
                      value={editTaskName}
                      onChange={(e) => setEditTaskName(e.target.value)}
                      className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-2"
                    />
                    <select
                      value={editEmployeeName}
                      onChange={(e) => setEditEmployeeName(e.target.value)}
                      className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-2"
                    >
                      {fullnames.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <DatePicker
                      className="w-full bg-[#020617] border-slate-700 rounded-xl"
                      value={editDeadline ? dayjs(editDeadline) : null}
                      onChange={(d, ds) => setEditDeadline(ds)}
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          statusStyles[task.status]
                        }`}
                      >
                        {task.status}
                      </span>
                      <HiOutlineClipboardList className="text-2xl text-slate-700" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 line-clamp-1">
                      {task.taskName}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                          <HiOutlineUser />
                        </div>
                        {task.employeeName}
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                          <HiOutlineCalendar />
                        </div>
                        {dayjs(task.deadline).format('DD MMM, YYYY')}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                    className="bg-[#020617] text-xs font-bold border border-slate-800 rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>

                  <div className="flex gap-2">
                    {editingId === task.id ? (
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 transition-all"
                      >
                        <FaCheck />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(task.id)
                          setEditTaskName(task.taskName)
                          setEditEmployeeName(task.employeeName)
                          setEditDeadline(task.deadline)
                        }}
                        className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition-all"
                      >
                        <FaPenToSquare />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 bg-slate-800 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-500/10 transition-all"
                    >
                      <FaTrashCan />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Tasks
