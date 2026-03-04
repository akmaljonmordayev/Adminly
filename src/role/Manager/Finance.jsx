import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import {
  FaUser,
  FaWallet,
  FaPercentage,
  FaPlusCircle,
  FaMinusCircle,
  FaCoins,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaMoneyBillWave,
  FaBuilding,
  FaEdit,
  FaCalendarAlt,
  FaCommentDots
} from 'react-icons/fa'

const columns = [
  { label: 'ID', icon: null },
  { label: 'Employee Name', icon: <FaUser /> },
  { label: 'Base Salary', icon: <FaWallet /> },
  { label: 'KPI %', icon: <FaPercentage /> },
  { label: 'KPI AMT', icon: <FaPlusCircle /> },
  { label: 'Bonus', icon: <FaPlusCircle /> },
  { label: 'Penalty', icon: <FaMinusCircle /> },
  { label: 'Net Total', icon: <FaCoins /> },
  { label: 'Status', icon: <FaCheckCircle /> },
  { label: 'Date', icon: <FaCalendarAlt /> },
  { label: 'Method', icon: <FaCreditCard /> },
  { label: 'Internal Comment', icon: <FaCommentDots /> },
  { label: 'Actions', icon: null },
]

const formatUZS = (num) => {
  if (!num && num !== 0) return "0 so'm"
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm"
}

const API_BASE = 'http://localhost:5000'
const YEARS = ['2025', '2026']

function Finance() {
  const [employees, setEmployees] = useState([])
  const [financeData, setFinanceData] = useState([])
  const [mergedData, setMergedData] = useState([])
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonth, setSelectedMonth] = useState('01')
  const [editData, setEditData] = useState(null)
  const [userCard, setUserCard] = useState(false)
  const [loading, setLoading] = useState(false)

  const monthsList = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: new Date(2026, i).toLocaleString('en-US', { month: 'long' }),
  }))

  const fetchData = async () => {
    try {
      const [empRes, finRes] = await Promise.all([
        axios.get(`${API_BASE}/employees`),
        axios.get(`${API_BASE}/employeeFinance`),
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
      const finRecord = financeData.find(
        (f) => f.employeeId === String(emp.id) && f.year == selectedYear
      )
      const fullMonthString = `${selectedYear}-${selectedMonth}`
      const monthly = finRecord?.monthly?.find((m) => m.month === fullMonthString)

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
  }, [employees, financeData, selectedYear, selectedMonth])

  const handleInputChange = (field, value) => {
    const newData = { ...editData, [field]: value }
    const base = Number(field === 'baseSalary' ? value : newData.baseSalary) || 0
    const kpiP = Number(field === 'kpiPercent' ? value : newData.kpiPercent) || 0
    const bonus = Number(field === 'bonus' ? value : newData.bonus) || 0
    const penalty = Number(field === 'penalty' ? value : newData.penalty) || 0

    const kpiAmt = Math.round((base * kpiP) / 100)
    newData.kpiAmount = kpiAmt
    newData.totalSalary = base + kpiAmt + bonus - penalty
    setEditData(newData)
  }

  const handleSave = async () => {
    if (!editData.financeRecordId) return toast.warning('Finance record not found')
    try {
      setLoading(true)
      const originalRecord = financeData.find((f) => f.id === editData.financeRecordId)
      const fullMonthString = `${selectedYear}-${selectedMonth}`
      const newEntry = {
        month: fullMonthString,
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
      const updatedMonthly = originalRecord.monthly.some((m) => m.month === fullMonthString)
        ? originalRecord.monthly.map((m) => (m.month === fullMonthString ? newEntry : m))
        : [...originalRecord.monthly, newEntry]

      await axios.put(`${API_BASE}/employeeFinance/${editData.financeRecordId}`, {
        ...originalRecord,
        monthly: updatedMonthly
      })
      toast.success('Successfully updated!')
      await fetchData()
      setUserCard(false)

      const currentUser = JSON.parse(localStorage.getItem('user'))
      await axios.post(`${API_BASE}/logs`, {
        userName: currentUser.name,
        action: 'UPDATE',
        date: new Date().toISOString(),
        page: 'FINANCE',
      })
    } catch (error) {
      toast.error('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const STATUS_CONFIG = {
    unpaid: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', dot: 'bg-rose-500', icon: <FaClock /> },
    reviewed: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-500', icon: <FaCheckCircle /> },
    paid: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400', icon: <FaCheckCircle /> },
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500', icon: <FaClock /> },
    rejected: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', dot: 'bg-slate-500', icon: <FaMinusCircle /> },
  }

  const METHOD_ICONS = {
    bank: <FaBuilding className="text-blue-400" />,
    cash: <FaMoneyBillWave className="text-emerald-400" />,
    card: <FaCreditCard className="text-purple-400" />,
  }

  return (
    <div className="w-full min-h-screen bg-[#020617] p-10 font-sans tracking-tight">
      <div className="max-w-[1700px] mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 blur-[80px] rounded-full" />
            <h1 className="text-5xl font-black text-white italic tracking-tighter mb-4">
              FINANCE <span className="text-cyan-400">ENGINE</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] opacity-70">
              PAYROLL MANAGEMENT & PERFORMANCE TRACKING
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/40 p-2 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none bg-slate-950/50 px-8 py-4 rounded-2xl text-cyan-400 font-black text-xs uppercase tracking-widest outline-none border border-slate-800 transition-all cursor-pointer hover:border-cyan-500/30"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y} FISCAL YEAR</option>
              ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-slate-950/50 px-8 py-4 rounded-2xl text-cyan-400 font-black text-xs uppercase tracking-widest outline-none border border-slate-800 transition-all cursor-pointer hover:border-cyan-500/30"
            >
              {monthsList.map((m) => (
                <option key={m.value} value={m.value}>{m.label.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </header>

        <div className="relative group overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-900/30 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <FaCoins size={300} className="text-cyan-500" />
          </div>

          <div className="overflow-x-auto no-scrollbar relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50">
                  {columns.map((col, idx) => (
                    <th key={idx} className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500/70 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-500/50">{col.icon}</span>
                        {col.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mergedData.map((row) => (
                  <tr key={row.id} className="group hover:bg-cyan-500/[0.02] transition-all duration-300">
                    <td className="p-8 font-mono text-[10px] text-slate-600">#{row.userId}</td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="text-white font-black italic tracking-tight text-lg">{row.fullName}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ACTIVE EMPLOYEE</span>
                      </div>
                    </td>
                    <td className="p-8 font-bold text-slate-200 whitespace-nowrap">{formatUZS(row.baseSalary)}</td>
                    <td className="p-8">
                      <span className="bg-slate-950/50 ring-1 ring-slate-800 px-3 py-1.5 rounded-lg text-xs font-black text-cyan-400">
                        {row.kpiPercent}%
                      </span>
                    </td>
                    <td className="p-8 text-emerald-400 font-black whitespace-nowrap">+{formatUZS(row.kpiAmount)}</td>
                    <td className="p-8 text-emerald-400 font-black whitespace-nowrap">+{formatUZS(row.bonus)}</td>
                    <td className="p-8 text-rose-500 font-black whitespace-nowrap">-{formatUZS(row.penalty)}</td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="text-cyan-400 font-black text-xl italic tracking-tighter whitespace-nowrap">
                          {formatUZS(row.totalSalary)}
                        </span>
                        <div className="h-1 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border ${STATUS_CONFIG[row.status].bg} ${STATUS_CONFIG[row.status].text} ${STATUS_CONFIG[row.status].border}`}>
                        <span className="text-xs">{STATUS_CONFIG[row.status].icon}</span>
                        {row.status}
                      </div>
                    </td>
                    <td className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {row.paymentDate ? row.paymentDate.split('-').reverse().join('.') : '---'}
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-3">
                        {METHOD_ICONS[row.paymentMethod]}
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{row.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="p-8 max-w-[200px]">
                      <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                        {row.comment || 'No administrative notes...'}
                      </p>
                    </td>
                    <td className="p-8">
                      <button
                        onClick={() => { setEditData(row); setUserCard(true); }}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:bg-cyan-500 hover:text-slate-950 transition-all duration-500 text-[10px] font-black uppercase tracking-widest"
                      >
                        <FaEdit /> MODIFY
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL REDESIGN */}
        {userCard && editData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl">
            <div className="bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in duration-300">
              <div className="px-12 py-10 flex justify-between items-start shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <FaWallet size={150} className="text-cyan-500" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-black text-white italic tracking-tighter mb-2">
                    {editData.fullName.toUpperCase()}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-lg tracking-widest">#{editData.userId}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedMonth}-{selectedYear} FISCAL DATA</span>
                  </div>
                </div>
                <button onClick={() => setUserCard(false)} className="bg-slate-800/50 p-4 rounded-2xl text-slate-400 hover:text-white transition-all relative z-10 hover:rotate-90 duration-300">
                  <FaMinusCircle size={20} />
                </button>
              </div>

              <div className="px-12 pb-10 space-y-10 overflow-y-auto flex-1 no-scrollbar">
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { label: 'Base Settlement', key: 'baseSalary', icon: <FaWallet /> },
                    { label: 'KPI Efficiency %', key: 'kpiPercent', icon: <FaPercentage /> },
                    { label: 'Achievement Bonus', key: 'bonus', icon: <FaPlusCircle /> },
                    { label: 'Penalty Deductions', key: 'penalty', icon: <FaMinusCircle /> },
                  ].map((f) => (
                    <div key={f.key} className="space-y-3">
                      <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] flex items-center gap-2">
                        <span className="text-cyan-500/50">{f.icon}</span> {f.label}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={editData[f.key]}
                          onChange={(e) => handleInputChange(f.key, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 p-5 rounded-[1.5rem] outline-none focus:border-cyan-500 transition-all text-white font-black text-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-white/5 w-full" />

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Processing Status</label>
                    <select
                      value={editData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-5 rounded-[1.5rem] outline-none text-cyan-400 text-xs font-black uppercase tracking-widest cursor-pointer hover:border-cyan-500 transition-all appearance-none"
                    >
                      {Object.keys(STATUS_CONFIG).map((sk) => (<option key={sk} value={sk}>{sk.toUpperCase()}</option>))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Settlement Method</label>
                    <select
                      value={editData.paymentMethod}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-5 rounded-[1.5rem] outline-none text-cyan-400 text-xs font-black uppercase tracking-widest cursor-pointer hover:border-cyan-500 transition-all appearance-none"
                    >
                      <option value="bank">BANK TRANSFER</option>
                      <option value="cash">CASH LIQUIDITY</option>
                      <option value="card">DEBIT/CREDIT CARD</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Scheduled Release Date</label>
                  <input
                    type="date"
                    value={editData.paymentDate}
                    onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-5 rounded-[1.5rem] outline-none text-white text-sm font-bold cursor-pointer focus:border-cyan-500 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Administrative Observations</label>
                  <textarea
                    value={editData.comment}
                    onChange={(e) => handleInputChange('comment', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-6 rounded-[1.5rem] outline-none text-slate-300 text-sm min-h-[140px] resize-none focus:border-cyan-500 transition-all font-medium leading-relaxed"
                    placeholder="Enter internal payroll notes..."
                  />
                </div>
              </div>

              <div className="px-12 py-10 bg-slate-900/60 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 shrink-0">
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] mb-2">Final Net Disbursement</p>
                  <p className="text-4xl font-black text-cyan-400 italic tracking-tighter">
                    {formatUZS(editData.totalSalary || 0)}
                  </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <button onClick={() => setUserCard(false)} className="flex-1 md:flex-none px-10 py-5 rounded-[1.5rem] bg-slate-800 hover:bg-slate-700 text-[10px] font-black text-white uppercase tracking-widest transition-all">
                    DISCARD
                  </button>
                  <button onClick={handleSave} disabled={loading} className="flex-1 md:flex-none px-12 py-5 rounded-[1.5rem] bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-2xl shadow-cyan-500/20">
                    {loading ? 'SYNCING...' : 'COMMIT CHANGES'}
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
