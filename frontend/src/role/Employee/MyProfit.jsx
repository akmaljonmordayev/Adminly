import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  FaWallet,
  FaChartLine,
  FaGift,
  FaUserSlash,
  FaCalendarCheck,
} from 'react-icons/fa'

function MyProfit() {
  const [monthlyData, setMonthlyData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [finance, setFinance] = useState(null)

  const getFinance = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/employeeFinance'
      )

      if (data.length > 0) {
        const months = data[0].monthly
        setMonthlyData(months)

        const lastMonth = months.at(-1)
        setSelectedMonth(lastMonth.month)
        setFinance(lastMonth)
      }
    } catch (error) {
      console.error('Finance fetch error:', error)
    }
  }

  useEffect(() => {
    getFinance()
  }, [])

  useEffect(() => {
    if (selectedMonth && monthlyData.length > 0) {
      const found = monthlyData.find(
        (item) => item.month === selectedMonth
      )
      setFinance(found)
    }
  }, [selectedMonth, monthlyData])

  if (!finance)
    return <div className="text-white text-lg font-medium">Loading...</div>

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
      <div className="min-h-screen flex items-center justify-center 
  bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#0b1220] 
  bg-[length:400%_400%] animate-[gradientMove_15s_ease_infinite] p-10">

        <section className="w-[1000px] bg-[#111827]/90 backdrop-blur-xl 
    rounded-3xl p-10 shadow-2xl border border-cyan-900/40">

          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-white">
              Finance Dashboard
            </h2>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-[#0f172a] text-cyan-400 border border-cyan-700 
          rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 
          hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 
          focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {monthlyData.map((item) => (
                <option key={item.month} value={item.month}>
                  {item.month}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">

            <div className="relative overflow-hidden group p-6 bg-[#1e293b] rounded-2xl 
        border border-cyan-900/30 transition-all duration-300 
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 
        hover:border-cyan-400 hover:ring-1 hover:ring-cyan-400/40">

              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl"></div>

              <div className="relative flex items-center gap-4 mb-3 text-cyan-400">
                <FaWallet className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-6" size={22} />
                <span className="font-semibold">Base Salary</span>
              </div>

              <p className="relative text-2xl font-bold text-white">
                {Number(finance.baseSalary || 0).toLocaleString()} UZS
              </p>
            </div>

            <div className="relative overflow-hidden group p-6 bg-[#1e293b] rounded-2xl 
        border border-emerald-900/30 transition-all duration-300 
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 
        hover:border-emerald-400 hover:ring-1 hover:ring-emerald-400/40">

              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl"></div>

              <div className="relative flex items-center gap-4 mb-3 text-emerald-400">
                <FaChartLine className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-6" size={22} />
                <span className="font-semibold">KPI Amount</span>
              </div>

              <p className="relative text-2xl font-bold text-white">
                +{Number(finance.kpiAmount || 0).toLocaleString()} UZS
              </p>
            </div>

            <div className="relative overflow-hidden group p-6 bg-[#1e293b] rounded-2xl 
        border border-amber-900/30 transition-all duration-300 
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20 
        hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40">

              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl"></div>

              <div className="relative flex items-center gap-4 mb-3 text-amber-400">
                <FaGift className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-6" size={22} />
                <span className="font-semibold">Bonus</span>
              </div>

              <p className="relative text-2xl font-bold text-white">
                +{Number(finance.bonus || 0).toLocaleString()} UZS
              </p>
            </div>

            <div className="relative overflow-hidden group p-6 bg-[#1e293b] rounded-2xl 
        border border-rose-900/30 transition-all duration-300 
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/20 
        hover:border-rose-400 hover:ring-1 hover:ring-rose-400/40">

              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl"></div>

              <div className="relative flex items-center gap-4 mb-3 text-rose-400">
                <FaUserSlash className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-6" size={22} />
                <span className="font-semibold">Penalty</span>
              </div>

              <p className="relative text-2xl font-bold text-white">
                -{Number(finance.penalty || 0).toLocaleString()} UZS
              </p>
            </div>

          </div>

          <div className="relative mt-12 p-8 bg-gradient-to-r from-[#0f172a] to-[#111827] 
      rounded-3xl flex justify-between items-center border border-cyan-900/40 
      shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 
      before:absolute before:inset-0 before:rounded-3xl before:border 
      before:border-cyan-500/20 before:blur-sm before:opacity-0 
      hover:before:opacity-100">

            <div className="relative">
              <p className="text-sm text-cyan-400 uppercase tracking-wider">
                Net Salary
              </p>
              <p className="text-lg text-gray-400">
                {finance.month}
              </p>
            </div>

            <h1 className={`relative text-4xl font-extrabold ${total < 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
              {total.toLocaleString()} UZS
            </h1>

          </div>

        </section>
      </div>
    </>
  )
}

export default MyProfit
