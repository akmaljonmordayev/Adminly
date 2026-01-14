import React, { useState, useEffect } from 'react'
import {
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineStatusOnline,
  HiOutlineRefresh,
  HiOutlineTrash,
} from 'react-icons/hi'

function TasksArchieve() {
  const tasksArchiveUrl = 'http://localhost:5000/tasksDeleted'
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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
  }, [])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    )

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Archived Tasks
        </h2>
        <div className="bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full">
          <span className="text-cyan-400 font-mono text-sm font-bold">
            {data.length}
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((delTask) => (
          <div
            key={delTask.id}
            className="relative bg-[#0b1220] border border-white/10 rounded-[30px] p-6 shadow-2xl overflow-hidden group hover:border-white/20 transition-none"
          >
            {/* Shisha effekti jilosi */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none"></div>

            <div className="space-y-4">
              {/* Vazifa nomi */}
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-white/5 rounded-xl border border-white/10 text-cyan-400">
                  <HiOutlineClipboardList className="text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {delTask.taskName}
                  </h3>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1 font-bold">
                    Task Name
                  </p>
                </div>
              </div>

              {/* Ma'lumotlar ro'yxati */}
              <div className="space-y-3 pt-2">
                {/* Xodim */}
                <div className="flex items-center gap-3 text-gray-300">
                  <HiOutlineUser className="text-gray-500 text-lg" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {delTask.employeeName}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase">
                      Assigned Employee
                    </span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-3 text-gray-300">
                  <HiOutlineCalendar className="text-gray-500 text-lg" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {delTask.deadline}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase">
                      Deadline Date
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 text-gray-300">
                  <HiOutlineStatusOnline className="text-gray-500 text-lg" />
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-bold ${
                        delTask.status === 'pending'
                          ? 'text-orange-400'
                          : 'text-green-400'
                      }`}
                    >
                      {delTask.status.charAt(0).toUpperCase() +
                        delTask.status.slice(1)}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase">
                      Current Status
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-6 border-t border-white/5 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 rounded-2xl border border-white/5 transition-none font-bold text-xs uppercase tracking-widest">
                  <HiOutlineRefresh className="text-lg" />
                  Restore
                </button>
                <button className="p-3 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-2xl border border-white/5 transition-none">
                  <HiOutlineTrash className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TasksArchieve
