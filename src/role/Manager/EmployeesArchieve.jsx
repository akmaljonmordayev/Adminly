import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  HiOutlineUserCircle,
  HiOutlineCalendar,
  HiOutlineTrash,
  HiOutlineRefresh,
  HiOutlineDotsVertical,
} from 'react-icons/hi'

function EmployeesArchieve() {
  const employeeArchiveUrl = 'http://localhost:5000/employeesDeleted'

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

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    )

  const restoreEmployee = async (employee) => {
    try {
      await axios.post('http://localhost:5000/employees', employee)
      await axios.delete(
        `http://localhost:5000/employeesDeleted/${employee.id}`,
      )
      toast.success('Employee restored successfully')
      fetchEmployeeArchive()
    } catch {
      toast.error('Restore failed')
    }
  }

  const deleteForever = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/employeesDeleted/${id}`)
      toast.error('Employee permanently deleted')
      fetchEmployeeArchive()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 px-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Archived Employees
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            Manage deleted employee records
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
          <span className="text-cyan-400 font-mono text-sm">{data.length}</span>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-separate border-spacing-y-2.5">
          <thead>
            <tr className="text-gray-500 text-[11px] uppercase tracking-[0.1em]">
              <th className="px-6 py-3 text-left font-semibold">
                Employee Information
              </th>
              <th className="px-6 py-3 text-left font-semibold">
                Month / Payment
              </th>
              <th className="px-6 py-3 text-left font-semibold">Amount</th>
              <th className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((delEmployee) => (
              <tr
                key={delEmployee.id}
                className="group bg-[#0b1220] hover:bg-white/[0.04] border border-white/5 shadow-xl transition-none"
              >
                <td className="px-6 py-4 rounded-l-[20px] border-y border-l border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/30 transition-none overflow-hidden">
                      <HiOutlineUserCircle className="text-3xl text-gray-400 group-hover:text-cyan-400 transition-none" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-[15px] leading-tight">
                        {delEmployee.fullName}
                      </span>
                      <span className="text-gray-500 text-[12px]">
                        {delEmployee.email}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 border-y border-white/5">
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-sm font-medium">
                      {delEmployee.month}
                    </span>
                    <span className="text-gray-500 text-[11px] font-mono">
                      {delEmployee.paymentDate}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 border-y border-white/5 text-sm">
                  <div className="flex flex-col font-mono">
                    <span className="text-white font-bold">
                      ${delEmployee.totalSalary}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase">
                      {delEmployee.paymentMethod}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 rounded-r-[20px] border-y border-r border-white/5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => restoreEmployee(delEmployee)}
                      title="Restore"
                      className="cursor-pointer p-2.5 bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 rounded-[12px] border border-white/5 hover:border-cyan-500/30 transition-none shadow-sm"
                    >
                      <HiOutlineRefresh className="text-lg" />
                    </button>

                    <button
                      onClick={() => deleteForever(delEmployee.id)}
                      title="Permanently delete"
                      className="p-2.5 cursor-pointer bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-[12px] border border-white/5 hover:border-red-500/30 transition-none shadow-sm"
                    >
                      <HiOutlineTrash className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  )
}

export default EmployeesArchieve
