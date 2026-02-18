import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

const columns = [
  'ID',
  'Name',
  'Base Salary',
  'KPI Percent',
  'KPI Amount',
  'Bonus',
  'Penalty',
  'Total',
  'Status',
  'Payment Date',
  'Payment Method',
  'Comment',
  'Actions',
]

const ITEMS_PER_PAGE = 10

const MONTHS = [
  { value: '2025-01', label: 'January 2025' },
  { value: '2025-02', label: 'February 2025' },
  { value: '2025-03', label: 'March 2025' },
  { value: '2025-04', label: 'April 2025' },
  { value: '2025-05', label: 'May 2025' },
  { value: '2025-06', label: 'June 2025' },
  { value: '2025-07', label: 'July 2025' },
  { value: '2025-08', label: 'August 2025' },
  { value: '2025-09', label: 'September 2025' },
  { value: '2025-10', label: 'October 2025' },
  { value: '2025-11', label: 'November 2025' },
  { value: '2025-12', label: 'December 2025' },
]

function Finance() {
  const [employees, setEmployees] = useState([])
  const [financeData, setFinanceData] = useState([])
  const [mergedData, setMergedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState('2025-01')
  const [editData, setEditData] = useState(null)
  const [userCard, setUserCard] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const user = JSON.parse(localStorage.getItem('user'))

  const totalPages = Math.ceil(mergedData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentData = mergedData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  /* ================= FETCH EMPLOYEES ================= */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5000/employees')
        setEmployees(res.data)
      } catch (error) {
        setErr(error.message)
      }
    }
    fetchEmployees()
  }, [])

  /* ================= FETCH FINANCE DATA ================= */
  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/employeeFinance')
        setFinanceData(res.data)
      } catch (error) {
        setErr(error.message)
      }
    }
    fetchFinanceData()
  }, [])

  /* ================= MERGE DATA BY SELECTED MONTH ================= */
  useEffect(() => {
    if (!employees.length || !financeData.length || !selectedMonth) return

    const merged = []

    employees.forEach((employee) => {
      const financeRecord = financeData.find((f) => f.id === employee.id)

      const monthlyData = financeRecord?.monthly.find(
        (m) => m.month === selectedMonth,
      )

      merged.push({
        id: employee.id,
        userId: employee.userId,
        fullName: employee.fullName,
        email: employee.email,

        baseSalary: monthlyData?.baseSalary || 0,
        kpiAmount: monthlyData?.kpiAmount || 0,
        kpiPercent: monthlyData?.baseSalary
          ? Math.round((monthlyData.kpiAmount / monthlyData.baseSalary) * 100)
          : 0,
        bonus: monthlyData?.bonus || 0,
        penalty: monthlyData?.penalty || 0,
        totalSalary: monthlyData?.totalSalary || 0,
        status: monthlyData?.status || 'pending',
        paymentDate: monthlyData?.paymentDate || '',
        paymentMethod: monthlyData?.paymentMethod || 'bank',
        comment: monthlyData?.comment || '',
        month: selectedMonth,
      })
    })

    setMergedData(merged)
    setCurrentPage(1)
  }, [employees, financeData, selectedMonth])

  /* ================= EDIT CLICK ================= */
  const handleEditClick = (row) => {
    setEditData(row)
    setUserCard(true)
  }

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!editData) return

    try {
      setLoading(true)

      const base = Number(editData.baseSalary) || 0
      const percent = Number(editData.kpiPercent) || 0
      const kpiAmount = Math.round((base * percent) / 100)
      const bonus = Number(editData.bonus) || 0
      const penalty = Number(editData.penalty) || 0
      const totalSalary = base + kpiAmount + bonus - penalty

      const financeRecord = financeData.find(
        (finance) => finance.id === editData.id,
      )

      if (!financeRecord) {
        toast.error('Employee finance record not found')
        setLoading(false)
        return
      }

      // Update the specific month
      const monthly = [...(financeRecord.monthly || [])]

      const index = monthly.findIndex((m) => m.month === selectedMonth)

      const newMonthData = {
        month: selectedMonth,
        baseSalary: base,
        kpiAmount,
        bonus,
        penalty,
        totalSalary,
        status: editData.status,
        paymentDate: editData.paymentDate,
        paymentMethod: editData.paymentMethod || 'bank',
        comment: editData.comment || '',
      }

      if (index !== -1) {
        monthly[index] = newMonthData
      } else {
        monthly.push(newMonthData)
      }

      const updatedMonthly = monthly

      const updatedRecord = {
        ...financeRecord,
        monthly: updatedMonthly,
      }

      // PATCH or PUT request - try PATCH first
      try {
        await axios.patch(
          `http://localhost:5000/employeeFinance/${editData.id}`,
          updatedRecord,
        )
      } catch (patchError) {
        // If PATCH fails, try PUT
        await axios.put(
          `http://localhost:5000/employeeFinance/${editData.id}`,
          updatedRecord,
        )
      }

      // Update local state
      setFinanceData((prev) =>
        prev.map((item) => (item.id === editData.id ? updatedRecord : item)),
      )

      toast.success('Finance data successfully updated!')

      // Log action
      try {
        await axios.post('http://localhost:5000/logs', {
          userName: user.name || 'Unknown',
          action: 'UPDATE',
          date: new Date().toISOString(),
          page: 'FINANCE',
        })
      } catch (logError) {
        console.log('Log error:', logError)
      }

      setUserCard(false)
      setEditData(null)
    } catch (error) {
      console.error('Save error:', error)
      toast.error(`Failed to update: ${error.message}`)
      setErr(error.message)
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setUserCard(false)
    setEditData(null)
  }

  const statusStyles = {
    paid: 'bg-emerald-500/20 text-emerald-400',
    unpaid: 'bg-rose-500/20 text-rose-400',
    pending: 'bg-amber-500/20 text-amber-400',
    reviewed: 'bg-sky-500/20 text-sky-400',
    partial: 'bg-violet-500/20 text-violet-400',
    overdue: 'bg-orange-500/20 text-orange-400',
    cancelled: 'bg-gray-500/20 text-gray-400',
  }

  return (
    <div className="w-full min-h-screen bg-[#0f172a] p-6 text-slate-300 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Financial Dashboard</h1>

          {/* Month Selector */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-400">Select Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-cyan-500 cursor-pointer outline-none"
            >
              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ================= MODAL ================= */}
        {userCard && editData && (
          <>
            <div
              onClick={closeModal}
              className="fixed inset-0 bg-black/70 z-40"
            />
            <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-h-[90vh] overflow-y-auto bg-[#0f172a] rounded-2xl border border-white/10">
              <div className="sticky top-0 bg-[#0f172a] p-6 border-b border-white/10 flex justify-between z-10">
                <h2 className="text-xl font-bold text-cyan-400">
                  {editData.fullName}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Base Salary', key: 'baseSalary' },
                    { label: 'KPI Percent (%)', key: 'kpiPercent' },
                    { label: 'KPI Amount', key: 'kpiAmount', readOnly: true },
                    { label: 'Bonus', key: 'bonus' },
                  ].map((f) => (
                    <div key={f.key} className="flex flex-col gap-1">
                      <label className="text-xs text-slate-400">
                        {f.label}
                      </label>
                      <input
                        type="number"
                        value={editData[f.key] || ''}
                        readOnly={f.readOnly}
                        onChange={(e) => {
                          const value = e.target.value
                          let updated = { ...editData, [f.key]: value }

                          if (
                            f.key === 'baseSalary' ||
                            f.key === 'kpiPercent'
                          ) {
                            const base =
                              f.key === 'baseSalary'
                                ? Number(value)
                                : Number(editData.baseSalary)
                            const percent =
                              f.key === 'kpiPercent'
                                ? Number(value)
                                : Number(editData.kpiPercent)

                            updated.kpiAmount = Math.round(
                              (base * percent) / 100,
                            )
                          }

                          setEditData(updated)
                        }}
                        className={`px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white outline-none ${
                          f.readOnly
                            ? 'opacity-70 cursor-not-allowed'
                            : 'focus:border-cyan-500'
                        }`}
                      />
                    </div>
                  ))}

                  {/* Penalty */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-red-400">Penalty</label>
                    <input
                      type="number"
                      value={editData.penalty || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, penalty: e.target.value })
                      }
                      className="px-3 py-2 rounded-xl bg-red-500/5 border border-red-500/20 text-red-200 outline-none focus:border-red-500/40"
                    />
                  </div>

                  {/* Payment Date */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      value={editData.paymentDate || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          paymentDate: e.target.value,
                        })
                      }
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">
                      Payment Method
                    </label>
                    <select
                      value={editData.paymentMethod || 'bank'}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="bank">Bank Transfer</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">
                      Payment Status
                    </label>
                    <select
                      value={editData.status || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, status: e.target.value })
                      }
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="partial">Partially Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Comment */}
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Comment</label>
                    <textarea
                      value={editData.comment || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, comment: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white resize-none outline-none focus:border-cyan-500"
                      rows="3"
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="bg-[#0b1221] p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase text-cyan-500 font-semibold">
                      Total Salary
                    </span>
                    <span className="text-2xl font-bold text-cyan-400">
                      {(
                        Number(editData.baseSalary || 0) +
                        Number(editData.kpiAmount || 0) +
                        Number(editData.bonus || 0) -
                        Number(editData.penalty || 0)
                      ).toLocaleString()}{' '}
                      $
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full py-3 bg-cyan-500 text-slate-900 font-bold rounded-xl hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto rounded-2xl no-scrollbar border border-white/10 bg-[#0f172a]">
          <table className="w-full text-sm">
            <thead className="bg-[#0f172a] text-slate-400 border-b border-white/10">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c}
                    className="px-4 py-3 text-left whitespace-nowrap font-medium"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentData.length > 0 ? (
                currentData.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">{row.userId}</td>
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">
                      {row.fullName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.baseSalary.toLocaleString()} $
                    </td>
                    <td className="px-4 py-3">{row.kpiPercent}%</td>
                    <td className="px-4 py-3 text-emerald-400 whitespace-nowrap">
                      +{row.kpiAmount.toLocaleString()} $
                    </td>
                    <td className="px-4 py-3 text-emerald-400 whitespace-nowrap">
                      +{row.bonus.toLocaleString()} $
                    </td>
                    <td className="px-4 py-3 text-red-400 whitespace-nowrap">
                      -{row.penalty.toLocaleString()} $
                    </td>
                    <td className="px-4 py-3 font-bold text-cyan-400 whitespace-nowrap">
                      {row.totalSalary.toLocaleString()} $
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusStyles[row.status] ||
                          'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.paymentDate}
                    </td>
                    <td className="px-4 py-3 capitalize whitespace-nowrap">
                      {row.paymentMethod}
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="truncate" title={row.comment}>
                        {row.comment || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEditClick(row)}
                        className="px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-400/30 rounded-full hover:bg-cyan-400 hover:text-slate-900 transition-colors whitespace-nowrap"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    No data available for{' '}
                    {MONTHS.find((m) => m.value === selectedMonth)?.label}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {err && (
          <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-red-400">{err}</p>
          </div>
        )}
      </div>
      <ToastContainer theme="dark" position="top-right" />
    </div>
  )
}

export default Finance
