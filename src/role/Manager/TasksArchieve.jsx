import { useTheme } from '../../context/ThemeContext';
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineStatusOnline,
  HiOutlineRefresh,
  HiOutlineTrash,
  HiOutlineClock
} from 'react-icons/hi'
import { FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi'

function TasksArchieve() {
  const tasksArchiveUrl = 'http://localhost:5000/tasksDeleted'
  const { isDarkMode } = useTheme();
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasksArchive = () => {
    fetch(tasksArchiveUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Data not found')
        return res.json()
      })
      .then((result) => {
        setData(result)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTasksArchive()
  }, [])

  const restoreTask = async (task) => {
    try {
      await axios.post('http://localhost:5000/tasks', task)
      await axios.delete(`http://localhost:5000/tasksDeleted/${task.id}`)
      toast.success('Task restored successfully')
      fetchTasksArchive()
    } catch {
      toast.error('Restore failed')
    }
  }

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task permanently?')) return
    try {
      await axios.delete(`http://localhost:5000/tasksDeleted/${id}`)
      toast.error('Task permanently deleted')
      fetchTasksArchive()
    } catch {
      toast.error('Delete failed')
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-2 border-purple-500/10 border-t-purple-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-purple-500/60 animate-pulse">Syncing Tasks...</p>
    </div>
  )

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight uppercase">Tasks <span className="text-purple-400 italic">History</span></h2>
          <p className="text-[var(--text-secondary)] text-xs font-medium mt-1">Found {data.length} archived tasks</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-500/5">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-purple-400 font-black text-xs uppercase tracking-widest">{data.length} Archived</span>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
          <div className="w-20 h-20 mx-auto mb-6 rounded-[2rem] bg-purple-500/5 flex items-center justify-center text-purple-400/30 border border-purple-500/10">
            <HiOutlineClipboardList size={48} />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Archive is Empty</h3>
          <p className="text-[var(--text-secondary)] text-xs mt-2 uppercase tracking-widest font-black opacity-40">No deleted task data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((delTask, i) => (
            <div
              key={delTask.id}
              className="group relative glass-strong rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 animate-fadeInScale"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-br from-purple-600/10 to-transparent group-hover:from-purple-600/20 transition-all duration-500" />

              <div className="p-7 relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                    <HiOutlineClipboardList size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => restoreTask(delTask)}
                      className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                    >
                      <HiOutlineRefresh size={20} />
                    </button>
                    <button
                      onClick={() => deleteTask(delTask.id)}
                      className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-black text-[var(--text-primary)] group-hover:text-purple-400 transition-colors uppercase leading-tight">{delTask.taskName}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400"><HiOutlineUser size={18} /></div>
                      <div>
                        <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest leading-none mb-1">Assigned To</p>
                        <p className="text-xs font-bold text-[var(--text-primary)]">{delTask.employeeName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400"><HiOutlineCalendar size={18} /></div>
                      <div>
                        <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest leading-none mb-1">Deadline</p>
                        <p className="text-xs font-bold text-[var(--text-primary)]">{delTask.deadline}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${delTask.status === 'pending' ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`} />
                    <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{delTask.status}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-secondary)] opacity-50 uppercase tracking-tighter">
                    <HiOutlineClock /> Archived
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer
        theme={isDarkMode ? 'dark' : 'light'}
        position="bottom-right"
        autoClose={2500}
        toastClassName="!rounded-2xl !bg-[var(--bg-secondary)] !border !border-white/5 !shadow-2xl"
      />
    </div>
  )
}

export default TasksArchieve
