import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { Line, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
)

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatUZS = (num) => {
  if (!num && num !== 0) return "0 so'm"
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " so'm"
}

export default function EmployeeAnalytics() {
  const [financeData, setFinanceData] = useState([])
  const [selectedYear, setSelectedYear] = useState('2026')
  const [chartDataAPI, setChartDataAPI] = useState(null)
  const [total, setTotal] = useState(0)

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/employeeFinance')
        setFinanceData(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (financeData.length > 0) {
      const employeeYearRecord = financeData.find(
        (e) => e.employeeId == user.id && e.year == selectedYear
      )

      if (employeeYearRecord) {
        const monthly = employeeYearRecord.monthly
        setChartDataAPI({
          salary: monthly.map((m) => m.baseSalary),
          kpi: monthly.map((m) => m.kpiAmount),
          bonus: monthly.map((m) => m.bonus),
          penalty: monthly.map((m) => m.penalty),
        })
        setTotal(monthly.reduce((sum, m) => sum + m.totalSalary, 0))
      } else {
        setChartDataAPI(null)
        setTotal(0)
      }
    }
  }, [financeData, selectedYear, user.id])

  const lineData = useMemo(() => {
    if (!chartDataAPI) return { labels: [], datasets: [] }
    return {
      labels: months,
      datasets: [
        { label: 'Salary', data: chartDataAPI.salary, borderColor: '#06b6d4', backgroundColor: '#06b6d4', tension: 0.4 },
        { label: 'Bonus', data: chartDataAPI.bonus, borderColor: '#22c55e', backgroundColor: '#22c55e', tension: 0.4 },
        { label: 'Penalty', data: chartDataAPI.penalty, borderColor: '#ef4444', backgroundColor: '#ef4444', tension: 0.4 },
        { label: 'KPI', data: chartDataAPI.kpi, borderColor: '#a855f7', backgroundColor: '#a855f7', tension: 0.4 },
      ],
    }
  }, [chartDataAPI])

  const pieData = useMemo(() => {
    if (!chartDataAPI) return { labels: [], datasets: [] }
    return {
      labels: ['Salary', 'Bonus', 'Penalty', 'KPI'],
      datasets: [
        {
          data: [
            chartDataAPI.salary.reduce((a, b) => a + b, 0),
            chartDataAPI.bonus.reduce((a, b) => a + b, 0),
            chartDataAPI.penalty.reduce((a, b) => a + b, 0),
            chartDataAPI.kpi.reduce((a, b) => a + b, 0),
          ],
          backgroundColor: ['#06b6d4', '#22c55e', '#ef4444', '#a855f7'],
          borderColor: '#020617',
          borderWidth: 2,
        },
      ],
    }
  }, [chartDataAPI])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black text-[var(--text-primary)] italic tracking-tighter">
            PROFIT <span className="text-cyan-400">ANALYTICS</span>
          </h1>

          <div className="flex items-center gap-3 bg-cyan-500/5 p-1 rounded-2xl border border-cyan-500/10">
            {['2025', '2026'].map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${selectedYear === y
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
              >
                {y} Year
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-[var(--card-bg)]/40 backdrop-blur-xl border border-cyan-500/10 rounded-[2.5rem] p-8 h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-widest text-sm opacity-50">Monthly Profit Trends</h2>
              <div className="text-right">
                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">Total Net Profit</p>
                <p className="text-2xl font-black text-cyan-400">{formatUZS(total)}</p>
              </div>
            </div>
            <div className="h-[380px]">
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#94a3b8', font: { weight: 'bold' } } } },
                  scales: {
                    y: { ticks: { color: '#64748b', callback: (v) => formatUZS(v) }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { ticks: { color: '#64748b' }, grid: { display: false } }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-[var(--card-bg)]/40 backdrop-blur-xl border border-cyan-500/10 rounded-[2.5rem] p-8 h-[500px] flex flex-col">
            <h2 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-widest text-sm opacity-50 mb-8 text-center">Structure Breakdown</h2>
            <div className="flex-1 min-h-0">
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 20, font: { weight: 'bold' } } }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {!chartDataAPI && (
          <div className="text-center py-20 bg-[var(--card-bg)]/20 border border-dashed border-cyan-500/10 rounded-[2rem]">
            <p className="text-[var(--text-secondary)] font-bold uppercase tracking-[0.3em]">No data records found for {selectedYear}</p>
          </div>
        )}
      </div>
    </div>
  )
}
