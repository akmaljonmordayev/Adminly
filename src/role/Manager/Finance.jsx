import React, { useState, useEffect } from 'react'
import axios from 'axios'

const columns = [
  'ID',
  'Name',
  'Base Salary',
  'KPI Percent',
  'KPI Amount',
  'Bonus',
  'Penalty',
  'Total',
  'Month',
  'Status',
  'Payment Date',
  'Payment Method',
  'Comment',
  'Actions',
]

const ITEMS_PER_PAGE = 10

function Finance() {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [singleUserId, setSingleUserId] = useState(null)
  const [editData, setEditData] = useState(null)
  const [userCard, setUserCard] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  /* ================= FETCH ALL ================= */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5000/employees')
        setData(res.data)
      } catch (error) {
        setErr(error.message)
      }
    }
    fetchEmployees()
  }, [])

  /* ================= FETCH SINGLE ================= */
  useEffect(() => {
    if (!singleUserId) return

    const fetchSingleUser = async () => {
      setLoading(true)
      try {
        const res = await axios.get(
          `http://localhost:5000/employees?userId=${singleUserId}`,
        )
        const user = res.data[0]
        setEditData(user)
      } catch (error) {
        setErr(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSingleUser()
  }, [singleUserId])

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      setLoading(true)

      const base = Number(editData.baseSalary) || 0
      const percent = Number(editData.kpiPercent) || 0
      const kpiAmount = Math.round((base * percent) / 100)
      const bonus = Number(editData.bonus) || 0
      const penalty = Number(editData.penalty) || 0

      const totalSalary = base + kpiAmount + bonus - penalty

      const updatedData = {
        ...editData,
        kpiAmount,
        totalSalary,
      }

      await axios.put(
        `http://localhost:5000/employees/${editData.id}`,
        updatedData,
      )

      toast.success('Finance successfully update')
      await axios.post('http://localhost:5000/logs', {
        userName: user.name,
        action: 'UPDATE',
        date: new Date().toISOString(),
        page: 'FINANCE',
      })

      setData((prev) =>
        prev.map((item) => (item.id === editData.id ? updatedData : item)),
      )
      setUserCard(false)
    } catch (error) {
      setErr(error.message)
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setUserCard(false)
    setSingleUserId(null)
    setEditData(null)
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-slate-300 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Financial Dashboard
        </h1>

        {/* ================= MODAL ================= */}
        {userCard && editData && (
          <>
            <div
              onClick={closeModal}
              className="fixed inset-0 bg-black/70 z-40"
            />
            <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-[#0f172a] rounded-2xl border border-white/10">
              <div className="p-6 border-b border-white/10 flex justify-between">
                <h2 className="text-xl font-bold text-cyan-400">
                  {editData.fullName}
                </h2>
                <button onClick={closeModal}>✕</button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Base, KPI Percent, KPI Amount, Bonus */}
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
                        className={`px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white ${
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
                      className="px-3 py-2 rounded-xl bg-red-500/5 border border-red-500/20 text-red-200"
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
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-cyan-500"
                    />
                  </div>

                  {/* Month */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Month</label>
                    <select
                      value={editData.month || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, month: e.target.value })
                      }
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="">Select Month</option>
                      {[
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                      ].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">
                      Payment Method
                    </label>
                    <select
                      value={editData.paymentMethod || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-cyan-500 cursor-pointer"
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
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="pending">Pending</option>
                      <option value="partial">Partially Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Comment (full width) */}
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Comment</label>
                    <textarea
                      value={editData.comment || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, comment: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white resize-none"
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="bg-[#0b1221] p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between">
                    <span className="text-xs uppercase text-cyan-500">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-cyan-400">
                      $
                      {Number(editData.baseSalary) +
                        Number(editData.kpiAmount) +
                        Number(editData.bonus) -
                        Number(editData.penalty)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-3 bg-cyan-500 text-slate-900 font-bold rounded-xl hover:bg-cyan-400"
                >
                  SAVE CHANGES
                </button>
              </div>
            </div>
          </>
        )}

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-[#0f172a] text-slate-400">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="px-4 py-3 text-left">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentData.map((row) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">{row.userId}</td>
                  <td className="px-4 py-3 text-white">{row.fullName}</td>
                  <td className="px-4 py-3">${row.baseSalary}</td>
                  <td className="px-4 py-3">{row.kpiPercent}%</td>
                  <td className="px-4 py-3 text-emerald-400">
                    +${row.kpiAmount}
                  </td>
                  <td className="px-4 py-3 text-emerald-400">+${row.bonus}</td>
                  <td className="px-4 py-3 text-red-400">-${row.penalty}</td>
                  <td className="px-4 py-3 font-bold text-cyan-400">
                    ${row.totalSalary}
                  </td>
                  <td className="px-4 py-3">{row.month}</td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3">{row.paymentDate}</td>
                  <td className="px-4 py-3">{row.paymentMethod}</td>
                  <td className="px-4 py-3">{row.comment}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSingleUserId(row.userId)
                        setUserCard(true)
                      }}
                      className="px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-400/30 rounded-full hover:bg-cyan-400 hover:text-slate-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {err && <p className="text-red-400 mt-4">{err}</p>}
      </div>
    </div>
  )
}

export default Finance
