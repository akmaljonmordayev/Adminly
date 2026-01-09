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
  'Payment Month',
  'Comment',
  'Actions',
]

const ITEMS_PER_PAGE = 10

function Finance() {
  const [data, setData] = useState([]),
    [currentPage, setCurrentPage] = useState(1),
    [singleUserId, setSingleUserId] = useState(null),
    [singleUserData, setSingleUserData] = useState(null),
    [userCard, setUserCard] = useState(false),
    [loading, setLoading] = useState(false),
    [err, setErr] = useState(''),
    [editData, setEditData] = useState(null)

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5000/employees')
        setData(res.data)
      } catch (error) {
        setErr(error.message)
      } finally {
      }
    }
    fetchEmployees()
  }, [])

  useEffect(() => {
    if (!singleUserId) return

    const fetchSingleUser = async () => {
      setLoading(true)
      try {
        const res = await axios.get(
          `http://localhost:5000/employees?userId=${singleUserId}`,
        )
        const userData = res.data[0]
        setSingleUserData(userData)
        setEditData(userData)
      } catch (error) {
        setErr(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSingleUser()
  }, [singleUserId])

  const handleSave = async () => {
    try {
      setLoading(true)
      const base = Number(editData.baseSalary)
      const kpi = Number(editData.kpiAmount)
      const bonus = Number(editData.bonus)
      const penalty = Number(editData.penalty)
      const finalTotal = base / kpi + bonus - penalty

      const updatedData = { ...editData, totalSalary: finalTotal }

      await axios.put(
        `http://localhost:5000/employees/${editData.id}`,
        updatedData,
      )

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

  const closeModel = () => {
    setUserCard(false)
    setSingleUserId(null)
    setEditData(null)
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 text-slate-300 font-sans selection:bg-cyan-500/30">
      <div className="relative z-10 max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-2 h-8 bg-cyan-400 rounded-full block"></span>
          Financial Dashboard
        </h1>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1e293b]/40 backdrop-blur-xl shadow-2xl">
          {loading && (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f172a]/90 backdrop-blur-md">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-32 h-32 border-4 border-t-cyan-500 border-b-cyan-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>

                <div className="absolute w-24 h-24 border-2 border-cyan-400/30 rounded-full animate-ping"></div>

                <div className="absolute w-20 h-20 border-2 border-r-cyan-300 border-l-cyan-300 border-t-transparent border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>

                <div className="relative w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-pulse"></div>
              </div>

              {/* Matn qismi */}
              <div className="mt-12 flex flex-col items-center gap-2">
                <span className="text-cyan-400 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
                  Loading Data
                </span>
                <div className="w-32 h-[2px] bg-slate-800 overflow-hidden rounded-full">
                  <div className="w-full h-full bg-cyan-500 -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                </div>
              </div>

              <style
                dangerouslySetInnerHTML={{
                  __html: `
      @keyframes shimmer {
        100% { transform: translateX(100%); }
      }
    `,
                }}
              />
            </div>
          )}

          {userCard && singleUserData && editData && (
            <>
              <div
                onClick={closeModel}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              />
              <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[500px] bg-[#0f172a] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
                  <h2 className="text-xl font-bold text-cyan-400">
                    {singleUserData.fullName}
                  </h2>
                  <button
                    onClick={closeModel}
                    className="text-slate-400 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Inputs */}
                    {[
                      { label: 'Base Salary', key: 'baseSalary' },
                      { label: 'KPI Amount', key: 'kpiAmount' },
                      { label: 'Bonus', key: 'bonus' },
                    ].map((f) => (
                      <div key={f.key} className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500">
                          {f.label}
                        </label>
                        <input
                          type="number"
                          value={editData[f.key] || ''}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              [f.key]: e.target.value,
                            })
                          }
                          className="bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    ))}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-red-400">
                        Penalty
                      </label>
                      <input
                        type="number"
                        value={editData.penalty || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, penalty: e.target.value })
                        }
                        className="bg-red-500/5 border border-red-500/20 rounded-xl px-3 py-2 text-red-200 outline-none"
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Comment"
                        value={editData.comment || ''}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            comment: e.target.value,
                          })
                        }
                        className="w-[435px] mb-3 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 resize-none"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-30 pt-4">
                        {/* Payment Method - To'lov usuli */}
                        <div className="flex flex-col gap-1.5">
                          <label
                            htmlFor="paymentMethod"
                            className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1"
                          >
                            Payment Method
                          </label>
                          <select
                            name="paymentMethod"
                            id="paymentMethod"
                            className="bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none w-30 focus:border-cyan-500 transition-all cursor-pointer appearance-none hover:bg-slate-800"
                          >
                            <option value="bank" className="bg-[#0f172a]">
                              Bank Transfer
                            </option>
                            <option value="cash" className="bg-[#0f172a]">
                              Cash
                            </option>
                          </select>
                        </div>

                        {/* Payment Status - To'lov holati */}
                        <div className="flex flex-col gap-1.5">
                          <label
                            htmlFor="paymentStatus"
                            className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1"
                          >
                            Payment Status
                          </label>
                          <select
                            name="paymentStatus"
                            id="paymentStatus"
                            className=" w-30 bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-cyan-400 font-medium outline-none focus:border-cyan-500 transition-all cursor-pointer appearance-none hover:bg-slate-800"
                          >
                            <option
                              value="paid"
                              className="bg-[#0f172a] text-emerald-400"
                            >
                              Paid
                            </option>
                            <option
                              value="unpaid"
                              className="bg-[#0f172a] text-red-400"
                            >
                              Unpaid
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* VIZUAL FORMULA QISMI */}
                  <div className="bg-[#0b1221] rounded-2xl p-4 border border-white/10 space-y-3">
                    <div className="flex items-center justify-around text-[10px] md:text-xs font-mono">
                      <div className="text-center">
                        <p className="text-emerald-400 font-bold">
                          ${Number(editData.baseSalary)}
                        </p>
                        <p className="text-slate-600">BASE</p>
                      </div>
                      <span className="text-slate-600">+</span>
                      <div className="text-center">
                        <p className="text-emerald-400 font-bold">
                          ${Number(editData.kpiAmount)}
                        </p>
                        <p className="text-slate-600">KPI</p>
                      </div>
                      <span className="text-slate-600">+</span>
                      <div className="text-center">
                        <p className="text-emerald-400 font-bold">
                          ${Number(editData.bonus)}
                        </p>
                        <p className="text-slate-600">BONUS</p>
                      </div>
                      <span className="text-slate-600">-</span>
                      <div className="text-center">
                        <p className="text-red-400 font-bold">
                          ${Number(editData.penalty)}
                        </p>
                        <p className="text-slate-600">PENALTY</p>
                      </div>
                    </div>

                    <div className="h-px bg-white/5 w-full"></div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-cyan-600 uppercase">
                        Total Result
                      </span>
                      <span className="text-2xl font-black text-cyan-400">
                        $
                        {Number(editData.baseSalary) /
                          Number(editData.kpiAmount) +
                          Number(editData.bonus) -
                          Number(editData.penalty)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg active:scale-95"
                  >
                    SAVE CHANGES
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#0f172a] text-xs uppercase text-slate-400 sticky top-0 z-20">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-6 py-5 font-semibold border-b border-white/10"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {currentData.map((row) => (
                  <tr
                    key={`${row.userId}-${row.month}`}
                    className="hover:bg-white/5 group transition-colors"
                  >
                    <td className="px-6 py-4">{row.userId}</td>
                    <td className="px-6 py-4 font-medium text-white">
                      {row.fullName}
                    </td>
                    <td className="px-6 py-4">${row.baseSalary}</td>
                    <td className="px-6 py-4">{row.kpiPercent}%</td>
                    <td className="px-6 py-4 text-emerald-400">
                      +${row.kpiAmount}
                    </td>
                    <td className="px-6 py-4 text-emerald-400">
                      +${row.bonus}
                    </td>
                    <td className="px-6 py-4 text-red-400">-${row.penalty}</td>
                    <td className="px-6 py-4 font-bold text-cyan-400">
                      ${row.totalSalary}
                    </td>
                    <td className="px-6 py-4">{row.month}</td>
                    <td className="px-6 py-4">{row.status}</td>
                    <td className="px-6 py-4">{row.paymentDate}</td>
                    <td className="px-6 py-4">{row.paymentMethod}</td>
                    <td className="px-6 py-4 truncate max-w-[150px]">
                      {row.comment}
                    </td>
                    <td className="px-6 py-4 sticky right-0 bg-[#162032]">
                      <button
                        onClick={() => {
                          setSingleUserId(row.userId)
                          setUserCard(true)
                        }}
                        className="px-4 py-1.5 text-xs font-bold text-cyan-400 bg-cyan-400/10 rounded-full border border-cyan-400/20 hover:bg-cyan-400 hover:text-slate-900 transition-all"
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
      </div>
    </div>
  )
}

export default Finance
