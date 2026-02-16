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
    <div className="flex m-[80px] justify-center">
      <section className="w-[1000px]  rounded-2xl bg-[#0b1220] border border-cyan-900/50 p-8 shadow-xl">

        <div className="mb-6 flex justify-end">
          <select
            value={selectedMonth}
          
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="custom-scroll absolute right-[10px] top-[80px] bg-[#111827] text-white border border-cyan-700 rounded-lg px-4 py-2 outline-none"
          >

            {monthlyData.map((item) => (
              <option key={item.month} value={item.month}>
                {item.month}
              </option>
            ))}
          </select>
        </div>

        <h3 className="text-white text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-cyan-500 rounded-full"></span>
          Finance Overview
        </h3>

        <div className="space-y-6">

          <div className="flex justify-between items-center text-base">
            <div className="flex items-center gap-3 text-cyan-400">
              <FaWallet size={22} />
              <span>Base Salary</span>
            </div>
            <span className="text-white font-semibold text-lg">
              {Number(finance.baseSalary || 0).toLocaleString()} UZS
            </span>
          </div>

          <div className="flex justify-between items-center text-base">
            <div className="flex items-center gap-3 text-cyan-400">
              <FaChartLine size={22} />
              <span>KPI Amount</span>
            </div>
            <span className="text-emerald-400 font-semibold text-lg">
              +{Number(finance.kpiAmount || 0).toLocaleString()} UZS
            </span>
          </div>

          <div className="flex justify-between items-center text-base">
            <div className="flex items-center gap-3 text-cyan-400">
              <FaGift size={22} />
              <span>Bonus</span>
            </div>
            <span className="text-emerald-400 font-semibold text-lg">
              +{Number(finance.bonus || 0).toLocaleString()} UZS
            </span>
          </div>

          <div className="flex justify-between items-center text-base">
            <div className="flex items-center gap-3 text-cyan-400">
              <FaUserSlash size={22} />
              <span>Penalty</span>
            </div>
            <span className="text-rose-500 font-semibold text-lg">
              -{Number(finance.penalty || 0).toLocaleString()} UZS
            </span>
          </div>

          <div className="h-[1px] bg-cyan-900/30"></div>

          <div className="flex justify-between items-center text-base">
            <div className="flex items-center gap-3 text-cyan-400">
              <FaCalendarCheck size={22} />
              <span>Salary Month</span>
            </div>
            <span className="text-white text-lg font-medium">
              {finance.month}
            </span>
          </div>

          <div className="mt-10 p-6 bg-cyan-600/10 border border-cyan-600/20 rounded-2xl flex justify-between items-center">
            <div>
              <p className="text-sm text-cyan-400 font-bold uppercase tracking-wider">
                Net Salary
              </p>
              <span className="text-white font-semibold text-lg">
                Total Payable
              </span>
            </div>

            <span
              className={`flex items-center justify-center text-3xl font-bold ${total < 0 ? 'text-rose-500' : 'text-cyan-400'
                }`}
            >
              {total.toLocaleString()}
              <span className="text-base font-medium ml-1">UZS</span>
            </span>
          </div>

        </div>
      </section>
    </div>
  )
}

export default MyProfit
