import { useTheme } from '../../context/ThemeContext';
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  HiOutlineUserCircle,
  HiOutlineCalendar,
  HiOutlineTrash,
  HiOutlineRefresh,
  HiOutlineMail,
  HiOutlineCurrencyDollar,
  HiOutlineCreditCard
} from 'react-icons/hi'
import { FiUser, FiMoreVertical, FiAlertCircle, FiClock } from 'react-icons/fi'

function EmployeesArchieve() {
  const employeeArchiveUrl = 'http://localhost:5000/employeesDeleted'
  const { isDarkMode } = useTheme();
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEmployeeArchive = () => {
    fetch(employeeArchiveUrl)
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
    fetchEmployeeArchive()
  }, [])

  const restoreEmployee = async (employee) => {
    try {
      await axios.post('http://localhost:5000/employees', employee)
      await axios.delete(`http://localhost:5000/employeesDeleted/${employee.id}`)
      toast.success('Employee restored successfully')
      fetchEmployeeArchive()
    } catch {
      toast.error('Restore failed')
    }
  }

  const deleteForever = async (id) => {
    if (!window.confirm('This action cannot be undone. Delete forever?')) return
    try {
      await axios.delete(`http://localhost:5000/employeesDeleted/${id}`)
      toast.error('Employee permanently deleted')
      fetchEmployeeArchive()
    } catch {
      toast.error('Delete failed')
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-2 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/60 animate-pulse">Syncing Archive...</p>
    </div>
  )

  return (
    <div className="w-full">
      {/* Search & Count area */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight uppercase">Employees <span className="text-cyan-400 italic">History</span></h2>
          <p className="text-[var(--text-secondary)] text-xs font-medium mt-1">Found {data.length} archived records</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-cyan-500/5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-black text-xs uppercase tracking-widest">{data.length} Records</span>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
          <div className="w-20 h-20 mx-auto mb-6 rounded-[2rem] bg-cyan-500/5 flex items-center justify-center text-cyan-400/30 border border-cyan-500/10">
            <HiOutlineUserCircle size={48} />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Archive is Empty</h3>
          <p className="text-[var(--text-secondary)] text-xs mt-2 uppercase tracking-widest font-black opacity-40">No deleted employee data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.map((delEmployee, i) => (
            <div
              key={delEmployee.id}
              className="group relative glass-strong rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-cyan-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 animate-fadeInScale"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Card Header Background */}
              <div className="absolute top-0 left-0 w-full h-[120px] bg-gradient-to-br from-cyan-600/10 to-transparent group-hover:from-cyan-600/20 transition-all duration-500" />

              <div className="p-7 relative z-10 flex flex-col h-full">
                {/* Top Info */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-[1.8rem] bg-gradient-to-br from-cyan-500 to-blue-600 p-[2px] shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <div className="w-full h-full rounded-[1.7rem] bg-[var(--bg-secondary)] flex items-center justify-center text-cyan-400">
                      <FiUser size={32} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => restoreEmployee(delEmployee)}
                      className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                      title="Restore"
                    >
                      <HiOutlineRefresh size={20} />
                    </button>
                    <button
                      onClick={() => deleteForever(delEmployee.id)}
                      className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95"
                      title="Delete Permanently"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-4 mb-8">
                  <div>
                    <h3 className="text-xl font-black text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors uppercase italic">{delEmployee.fullName}</h3>
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-[11px] mt-1 font-bold">
                      <HiOutlineMail className="text-cyan-500" /> {delEmployee.email}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest mb-1">Salary Point</p>
                      <p className="text-sm font-black text-[var(--text-primary)] font-mono">${delEmployee.totalSalary || '0'}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest mb-1">Last Cycle</p>
                      <p className="text-sm font-black text-[var(--text-primary)] uppercase">{delEmployee.month || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HiOutlineCalendar className="text-cyan-500" />
                    <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase">{delEmployee.paymentDate || 'No Date'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-white/5 text-[var(--text-secondary)] uppercase tracking-widest border border-white/5">{delEmployee.paymentMethod || 'CASH'}</span>
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

export default EmployeesArchieve
