import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  FaWallet,
  FaChartLine,
  FaGift,
  FaUserSlash,
  FaCalculator,
} from 'react-icons/fa'

const formatUZS = (num) => {
  if (!num && num !== 0) return "0 so'm"
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " so'm"
}

function MyProfit() {
  const [allYearsData, setAllYearsData] = useState([])
  const [selectedYear, setSelectedYear] = useState('2026')
  const [monthlyData, setMonthlyData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [finance, setFinance] = useState(null)

  // Calulator state
  const [calcBase, setCalcBase] = useState(0)
  const [calcKpi, setCalcKpi] = useState(0)
  const [calcBonus, setCalcBonus] = useState(0)
  const [calcPenalty, setCalcPenalty] = useState(0)

  const getFinance = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/employeeFinance'
      )

      const currentUser = JSON.parse(localStorage.getItem('user'))
      // In a real app, we filter by employeeId. 
      // AssumingcurrentUser.id maps to employeeId in employeeFinance
      const myData = data.filter(item => item.employeeId == currentUser?.id || item.employeeId == "1")

      if (myData.length > 0) {
        setAllYearsData(myData)
        const yearRecord = myData.find(item => item.year == selectedYear) || myData[0]
        setSelectedYear(yearRecord.year.toString())
        setMonthlyData(yearRecord.monthly)

        const lastMonth = yearRecord.monthly.at(-1)
        setSelectedMonth(lastMonth.month)
        setFinance(lastMonth)

        // Sync calculator with current month
        setCalcBase(lastMonth.baseSalary)
        setCalcKpi(lastMonth.kpiAmount)
        setCalcBonus(lastMonth.bonus)
        setCalcPenalty(lastMonth.penalty)
      }
    } catch (error) {
      console.error('Finance fetch error:', error)
    }
  }

  useEffect(() => {
    getFinance()
  }, [])

  useEffect(() => {
    if (allYearsData.length > 0) {
      const yearRecord = allYearsData.find(item => item.year == selectedYear)
      if (yearRecord) {
        setMonthlyData(yearRecord.monthly)
        const lastMonth = yearRecord.monthly.at(-1)
        setSelectedMonth(lastMonth.month)
      }
    }
  }, [selectedYear])

  useEffect(() => {
    if (selectedMonth && monthlyData.length > 0) {
      const found = monthlyData.find(
        (item) => item.month === selectedMonth
      )
      setFinance(found)
    }
  }, [selectedMonth, monthlyData])

  if (!finance)
    return <div className="text-[var(--text-primary)] text-xl font-medium p-20 text-center">Loading Finance Data...</div>

  const total =
    Number(finance.baseSalary || 0) +
    Number(finance.kpiAmount || 0) +
    Number(finance.bonus || 0) -
    Number(finance.penalty || 0)

  return (
    <>
      <style>
        {`
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`}
      </style>
      <div className="min-h-screen flex flex-col items-center justify-center 
  bg-[var(--bg-primary)] p-10 transition-colors duration-300">

        <section className="w-[1000px] bg-[var(--card-bg)] backdrop-blur-xl 
    rounded-3xl p-10 shadow-2xl border border-cyan-500/10 transition-colors">

          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">
              Finance Dashboard
            </h2>

            <div className="flex gap-4">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-[var(--card-bg)] text-cyan-400 border border-cyan-700 
            rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 
            hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {[...new Set(allYearsData.map(d => d.year))].sort().map(y => (
                  <option key={y} value={y}>{y} Year</option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-[var(--card-bg)] text-cyan-400 border border-cyan-700 
            rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 
            hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {monthlyData.map((item) => (
                  <option key={item.month} value={item.month}>
                    {item.month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative overflow-hidden group p-6 bg-[var(--bg-secondary)]/50 rounded-2xl 
          border border-cyan-500/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10">
              <div className="relative flex items-center gap-4 mb-3 text-cyan-400">
                <FaWallet size={22} />
                <span className="font-semibold">Base Salary</span>
              </div>
              <p className="relative text-2xl font-bold text-[var(--text-primary)]">
                {formatUZS(finance.baseSalary || 0)}
              </p>
            </div>

            <div className="relative overflow-hidden group p-6 bg-[var(--bg-secondary)]/50 rounded-2xl 
          border border-emerald-500/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="relative flex items-center gap-4 mb-3 text-emerald-400">
                <FaChartLine size={22} />
                <span className="font-semibold">KPI Amount</span>
              </div>
              <p className="relative text-2xl font-bold text-[var(--text-primary)]">
                +{formatUZS(finance.kpiAmount || 0)}
              </p>
            </div>

            <div className="relative overflow-hidden group p-6 bg-[var(--bg-secondary)]/50 rounded-2xl 
          border border-amber-500/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10">
              <div className="relative flex items-center gap-4 mb-3 text-amber-400">
                <FaGift size={22} />
                <span className="font-semibold">Bonus</span>
              </div>
              <p className="relative text-2xl font-bold text-[var(--text-primary)]">
                +{formatUZS(finance.bonus || 0)}
              </p>
            </div>

            <div className="relative overflow-hidden group p-6 bg-[var(--bg-secondary)]/50 rounded-2xl 
          border border-rose-500/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/10">
              <div className="relative flex items-center gap-4 mb-3 text-rose-400">
                <FaUserSlash size={22} />
                <span className="font-semibold">Penalty</span>
              </div>
              <p className="relative text-2xl font-bold text-[var(--text-primary)]">
                -{formatUZS(finance.penalty || 0)}
              </p>
            </div>
          </div>

          <div className="relative mt-12 p-8 bg-[var(--bg-secondary)]/30 
        rounded-3xl flex justify-between items-center border border-cyan-500/10 shadow-xl transition-all duration-500">
            <div className="relative">
              <p className="text-sm text-cyan-400 uppercase tracking-wider">Net Salary</p>
              <p className="text-lg text-gray-400">{finance.month}</p>
            </div>
            <h1 className={`relative text-4xl font-extrabold ${total < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatUZS(total)}
            </h1>
          </div>

          {/* Calculator Section */}
          <div className="mt-16 bg-[var(--bg-secondary)]/30 rounded-3xl p-8 border border-white/5 transition-colors">
            <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
              <FaCalculator /> Salary Simulator
            </h3>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div>
                <label className="text-xs text-gray-400 uppercase mb-1 block">Base Salary</label>
                <input
                  type="number"
                  value={calcBase}
                  onChange={(e) => setCalcBase(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-cyan-500/10 rounded-xl px-3 py-2 text-[var(--text-primary)] focus:border-cyan-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase mb-1 block">KPI Amount</label>
                <input
                  type="number"
                  value={calcKpi}
                  onChange={(e) => setCalcKpi(e.target.value)}
                  className="w-full bg-[var(--card-bg)] border border-emerald-900/50 rounded-xl px-3 py-2 text-[var(--text-primary)] focus:border-emerald-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase mb-1 block">Bonus</label>
                <input
                  type="number"
                  value={calcBonus}
                  onChange={(e) => setCalcBonus(e.target.value)}
                  className="w-full bg-[var(--card-bg)] border border-amber-900/50 rounded-xl px-3 py-2 text-[var(--text-primary)] focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase mb-1 block">Penalty</label>
                <input
                  type="number"
                  value={calcPenalty}
                  onChange={(e) => setCalcPenalty(e.target.value)}
                  className="w-full bg-[var(--card-bg)] border border-rose-900/50 rounded-xl px-3 py-2 text-[var(--text-primary)] focus:border-rose-400 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-between items-center p-6 bg-cyan-400/5 rounded-2xl border border-cyan-400/20">
              <span className="text-gray-400">Estimated Total:</span>
              <span className="text-2xl font-bold text-cyan-400">
                {formatUZS(Number(calcBase) + Number(calcKpi) + Number(calcBonus) - Number(calcPenalty))}
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default MyProfit
