import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

const columns = [
  'ID',
  'Name',
  'Base Salary',
  'KPI %',
  'KPI Amt',
  'Bonus',
  'Penalty',
  'Total',
  'Status',
  'Date',
  'Method',
  'Comment',
  'Actions',
]

const ITEMS_PER_PAGE = 10
const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: `2026-${String(i + 1).padStart(2, '0')}`,
  label: `${new Date(2026, i).toLocaleString('en-US', { month: 'long' })} 2026`,
}))

function Finance() {
  const [employees, setEmployees] = useState([])
  const [financeData, setFinanceData] = useState([])
  const [mergedData, setMergedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState('2026-01')
  const [editData, setEditData] = useState(null)
  const [userCard, setUserCard] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
      const [empRes, finRes] = await Promise.all([
        axios.get('http://localhost:5000/employees'),
        axios.get('http://localhost:5000/employeeFinance'),
      ])
      setEmployees(empRes.data)
      setFinanceData(finRes.data)
    } catch (error) {
      toast.error('Data loading failed')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (!employees.length) return
    const merged = employees.map((emp) => {
      const finRecord = financeData.find((f) => f.employeeId === String(emp.id))
      const monthly = finRecord?.monthly?.find((m) => m.month === selectedMonth)

      const base = Number(monthly?.baseSalary || 0)
      const kpiAmt = Number(monthly?.kpiAmount || 0)
      const bonus = Number(monthly?.bonus || 0)
      const penalty = Number(monthly?.penalty || 0)

      return {
        id: emp.id,
        financeRecordId: finRecord?.id,
        userId: emp.userId,
        fullName: emp.fullName,
        baseSalary: base,
        kpiAmount: kpiAmt,
        kpiPercent: base > 0 ? Math.round((kpiAmt / base) * 100) : 0,
        bonus: bonus,
        penalty: penalty,
        totalSalary: monthly?.totalSalary || base + kpiAmt + bonus - penalty,
        status: monthly?.status || 'unpaid',
        paymentDate: monthly?.paymentDate || '',
        paymentMethod: monthly?.paymentMethod || 'bank',
        comment: monthly?.comment || '',
      }
    })
    setMergedData(merged)
  }, [employees, financeData, selectedMonth])

  const handleInputChange = (field, value) => {
    const newData = { ...editData, [field]: value }
    const base =
      Number(field === 'baseSalary' ? value : newData.baseSalary) || 0
    const kpiP =
      Number(field === 'kpiPercent' ? value : newData.kpiPercent) || 0
    const bonus = Number(field === 'bonus' ? value : newData.bonus) || 0
    const penalty = Number(field === 'penalty' ? value : newData.penalty) || 0

    const kpiAmt = Math.round((base * kpiP) / 100)
    newData.kpiAmount = kpiAmt
    newData.totalSalary = base + kpiAmt + bonus - penalty
    setEditData(newData)
  }

  const handleSave = async () => {
    if (!editData.financeRecordId)
      return toast.warning('Finance record not found')
    try {
      setLoading(true)
      const originalRecord = financeData.find(
        (f) => f.id === editData.financeRecordId,
      )
      const newEntry = {
        month: selectedMonth,
        baseSalary: Number(editData.baseSalary),
        kpiAmount: Number(editData.kpiAmount),
        bonus: Number(editData.bonus),
        penalty: Number(editData.penalty),
        totalSalary: Number(editData.totalSalary),
        status: editData.status,
        paymentDate: editData.paymentDate,
        paymentMethod: editData.paymentMethod,
        comment: editData.comment,
      }
      const updatedMonthly = originalRecord.monthly.some(
        (m) => m.month === selectedMonth,
      )
        ? originalRecord.monthly.map((m) =>
            m.month === selectedMonth ? newEntry : m,
          )
        : [...originalRecord.monthly, newEntry]

      await axios.put(
        `http://localhost:5000/employeeFinance/${editData.financeRecordId}`,
        { ...originalRecord, monthly: updatedMonthly },
      )
      toast.success('Successfully updated!')
      await fetchData()
      setUserCard(false)
    } catch (error) {
      toast.error('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const currentData = mergedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const STATUS_CONFIG = {
    unpaid: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/20',
      dot: 'bg-rose-500',
    },
    reviewed: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
      dot: 'bg-blue-500',
    },
    paid: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-400',
    },
    pending: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      dot: 'bg-amber-500',
    },
    rejected: {
      bg: 'bg-gray-500/10',
      text: 'text-gray-400',
      border: 'border-gray-500/20',
      dot: 'bg-gray-500',
    },
  }

  return (
    <div className="w-full min-h-screen bg-[#020617] p-8 text-slate-300 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2 italic">
              FINANCE DASHBOARD
            </h1>
          </div>
          <div className="group relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 font-bold outline-none focus:ring-4 ring-cyan-500/10 transition-all cursor-pointer min-w-[220px]"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-cyan-500/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/30 border-b border-slate-800">
                  {columns.map((c) => (
                    <th
                      key={c}
                      className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {currentData.map((row) => (
                  <tr
                    key={row.id}
                    className="group hover:bg-white/[0.02] transition-all"
                  >
                    <td className="p-5 font-mono text-xs text-slate-600">
                      #{row.userId}
                    </td>
                    <td className="p-5 font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {row.fullName}
                    </td>
                    <td className="p-5 font-medium">
                      {row.baseSalary.toLocaleString()}
                    </td>
                    <td className="p-5">
                      <span className="bg-slate-800 px-2 py-1 rounded text-xs">
                        {row.kpiPercent}%
                      </span>
                    </td>
                    <td className="p-5 text-emerald-400 font-semibold">
                      +{row.kpiAmount.toLocaleString()}
                    </td>
                    <td className="p-5 text-emerald-400">
                      +{row.bonus.toLocaleString()}
                    </td>
                    <td className="p-5 text-rose-500">
                      -{row.penalty.toLocaleString()}
                    </td>
                    <td className="p-5">
                      <span className="text-cyan-400 font-black">
                        {row.totalSalary.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-5">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          row.status === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            row.status === 'paid'
                              ? 'bg-emerald-400'
                              : 'bg-amber-400'
                          }`}
                        ></span>
                        {row.status}
                      </div>
                    </td>
                    <td className="p-5 text-xs text-slate-500">
                      {row.paymentDate || '---'}
                    </td>
                    <td className="p-5 text-[10px] uppercase font-bold text-slate-600">
                      {row.paymentMethod}
                    </td>
                    <td className="p-5 text-xs italic text-slate-500 truncate max-w-[120px]">
                      {row.comment || 'No comment'}
                    </td>
                    <td className="p-5">
                      <button
                        onClick={() => {
                          setEditData(row)
                          setUserCard(true)
                        }}
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {userCard && editData && (
          <div className=" fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 w-full rounded-[2.5rem] shadow-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800">
                <h2 className="text-2xl font-black text-white">
                  {editData.fullName}{' '}
                  <span className="text-cyan-500 text-sm ml-2 font-mono">
                    #{editData.userId}
                  </span>
                </h2>
                <button
                  onClick={() => setUserCard(false)}
                  className="text-slate-500 hover:text-white text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="p-8 grid grid-cols-2 gap-6">
                {[
                  { label: 'Base Salary', key: 'baseSalary', type: 'number' },
                  { label: 'KPI %', key: 'kpiPercent', type: 'number' },
                  { label: 'Bonus', key: 'bonus', type: 'number' },
                  { label: 'Penalty', key: 'penalty', type: 'number' },
                ].map((f) => (
                  <div key={f.key} className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      value={editData[f.key]}
                      onChange={(e) => handleInputChange(f.key, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-cyan-500 focus:ring-1 ring-cyan-500/50 transition-all text-white font-bold"
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">
                    Status
                  </label>
                  <select
                    value={editData.status}
                    onChange={(e) =>
                      handleInputChange('status', e.target.value)
                    }
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none text-white font-bold"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={editData.paymentDate}
                    onChange={(e) =>
                      handleInputChange('paymentDate', e.target.value)
                    }
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none text-white font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">
                    Method
                  </label>
                  <select
                    value={editData.paymentMethod}
                    onChange={(e) =>
                      handleInputChange('paymentMethod', e.target.value)
                    }
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none text-white font-bold"
                  >
                    <option value="bank">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                  </select>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">
                    Comment
                  </label>
                  <textarea
                    value={editData.comment}
                    onChange={(e) =>
                      handleInputChange('comment', e.target.value)
                    }
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none text-white min-h-[80px]"
                    placeholder="Add notes..."
                  />
                </div>
              </div>

              <div className="p-8 bg-slate-800/50 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">
                    Final Amount
                  </p>
                  <p className="text-3xl font-black text-cyan-400">
                    {editData.totalSalary?.toLocaleString()}{' '}
                    <span className="text-xs text-slate-400 font-medium">
                      UZS
                    </span>
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setUserCard(false)}
                    className="px-8 py-4 rounded-2xl bg-slate-700 hover:bg-slate-600 font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-10 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
                  >
                    {loading ? 'PROCESSING...' : 'SAVE DATA'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer theme="dark" position="bottom-right" />
    </div>
  )
}

export default Finance
