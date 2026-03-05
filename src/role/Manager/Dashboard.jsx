import React, { useState, useEffect } from 'react'
import Card from '../../components/Card'
import {
  FaUsers,
  FaTasks,
  FaBullhorn,
  FaExclamationCircle,
  FaSignOutAlt,
  FaHistory,
  FaUmbrellaBeach,
} from 'react-icons/fa'
import axios from 'axios'
import { Bar, Pie } from 'react-chartjs-2'

const formatUZS = (num) => {
  if (!num && num !== 0) return "0 so'm"
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm"
}

function Dashboard() {
  const [allEmployees, setAllEmployees] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [allComplaints, setAllComplaints] = useState([])
  const [allAnnouncements, setAllAnnouncements] = useState([])
  const [allVacations, setAllVacations] = useState([])
  const [allLeaves, setAllLeaves] = useState([])
  const [allLogs, setAllLogs] = useState([])
  const [financeEmployee, setFinanceEmployee] = useState([])

  const [archive1, setArchive1] = useState([])
  const [archive2, setArchive2] = useState([])
  const [archive3, setArchive3] = useState([])
  const [archive4, setArchive4] = useState([])

  const [selectedYear, setSelectedYear] = useState('2026')

  const fetchData = async () => {
    try {
      const [emp, tasks, comp, ann, vac, resignation, logs, fin, arch1, arch2, arch3, arch4] = await Promise.all([
        axios.get('http://localhost:5000/employees'),
        axios.get('http://localhost:5000/tasks'),
        axios.get('http://localhost:5000/complaints'),
        axios.get('http://localhost:5000/announcements'),
        axios.get('http://localhost:5000/vacations'),
        axios.get('http://localhost:5000/resignationLeaves'),
        axios.get('http://localhost:5000/logs'),
        axios.get('http://localhost:5000/employeeFinance'),
        axios.get('http://localhost:5000/employeesDeleted'),
        axios.get('http://localhost:5000/tasksDeleted'),
        axios.get('http://localhost:5000/complaintsDeleted'),
        axios.get('http://localhost:5000/announcementsDeleted'),
      ])

      setAllEmployees(emp.data || [])
      setAllTasks(tasks.data || [])
      setAllComplaints(comp.data || [])
      setAllAnnouncements(ann.data || [])
      setAllVacations(vac.data || [])
      setAllLeaves(resignation.data || [])
      setAllLogs(logs.data || [])
      setFinanceEmployee(fin.data || [])

      setArchive1(arch1.data || [])
      setArchive2(arch2.data || [])
      setArchive3(arch3.data || [])
      setArchive4(arch4.data || [])
    } catch (error) {
      console.error('Manager Dashboard fetch error:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredTasks = allTasks.filter(t => t.deadline?.startsWith(selectedYear))
  const filteredComplaints = allComplaints.filter(c => c.date?.startsWith(selectedYear))
  const filteredAnnouncements = allAnnouncements.filter(a => a.date?.startsWith(selectedYear))
  const filteredVacations = allVacations.filter(v => v.startDate?.startsWith(selectedYear))
  const filteredLeaves = allLeaves.filter(l => l.appliedDate?.startsWith(selectedYear))
  const filteredLogs = allLogs.filter(log => log.date?.startsWith(selectedYear))

  const archiveCount = archive1.length + archive2.length + archive3.length + archive4.length

  const filteredFinance = financeEmployee.filter(emp => emp.year == selectedYear)

  const allSalary = filteredFinance.reduce((acc, emp) => acc + emp.monthly.reduce((mAcc, m) => mAcc + Number(m.baseSalary || 0), 0), 0)
  const allBonus = filteredFinance.reduce((acc, emp) => acc + emp.monthly.reduce((mAcc, m) => mAcc + Number(m.bonus || 0), 0), 0)
  const allPenalty = filteredFinance.reduce((acc, emp) => acc + emp.monthly.reduce((mAcc, m) => mAcc + Number(m.penalty || 0), 0), 0)
  const allKpiAmount = filteredFinance.reduce((acc, emp) => acc + emp.monthly.reduce((mAcc, m) => mAcc + Number(m.kpiAmount || 0), 0), 0)

  const barChartData = {
    labels: ['Tasks', 'Complaints', 'Announcements', 'Vacations', 'Leaves', 'Logs'],
    datasets: [
      {
        label: `${selectedYear} Total Statistics`,
        data: [
          filteredTasks.length,
          filteredComplaints.length,
          filteredAnnouncements.length,
          filteredVacations.length,
          filteredLeaves.length,
          filteredLogs.length,
        ],
        backgroundColor: [
          'rgba(168, 85, 247, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(148, 163, 184, 0.7)',
          'rgba(132, 204, 22, 0.7)',
        ],
        hoverBackgroundColor: ['#a855f7', '#ef4444', '#3b82f6', '#10b981', '#94a3b8', '#84cc16'],
        borderRadius: 10,
        borderWidth: 0,
        borderSkipped: false,
      },
    ],
  }

  const financeChartData = {
    labels: ['Salary', 'Bonus', 'Penalty', 'KPI'],
    datasets: [
      {
        data: [allSalary, allBonus, allPenalty, allKpiAmount],
        backgroundColor: [
          'rgba(6, 182, 212, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        hoverBackgroundColor: ['#06b6d4', '#22c55e', '#ef4444', '#a855f7'],
        borderColor: 'rgba(2, 6, 23, 0.8)',
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#020617] relative">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-8%] left-[10%] w-[35%] h-[35%] bg-cyan-900/15 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-5%] right-[5%] w-[30%] h-[30%] bg-purple-900/15 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] right-[20%] w-[20%] h-[20%] bg-blue-900/10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 pt-6 px-6 pb-12">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 max-w-[1600px] mx-auto animate-fadeInUp">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">OVERVIEW</span>
              <span className="text-white ml-2">DASHBOARD</span>
            </h1>
            <p className="text-slate-600 text-xs font-medium mt-1 tracking-wider uppercase">Real-time analytics & statistics</p>
          </div>

          <div className="flex items-center gap-2 glass rounded-2xl p-1.5">
            {['2025', '2026'].map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${selectedYear === y
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                  : "text-slate-500 hover:text-white hover:bg-white/5"
                  }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="max-w-[1600px] mx-auto mb-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {[
              { title: "EMPLOYEES", value: allEmployees.length, icon: <FaUsers />, color: "cyan", delay: "stagger-1" },
              { title: "TASKS", value: filteredTasks.length, icon: <FaTasks />, color: "purple", delay: "stagger-2" },
              { title: "COMPLAINTS", value: filteredComplaints.length, icon: <FaExclamationCircle />, color: "red", delay: "stagger-3" },
              { title: "ANNOUNCEMENTS", value: filteredAnnouncements.length, icon: <FaBullhorn />, color: "blue", delay: "stagger-4" },
              { title: "VACATIONS", value: filteredVacations.length, icon: <FaUmbrellaBeach />, color: "green", delay: "stagger-5" },
              { title: "RESIGNATIONS", value: filteredLeaves.length, icon: <FaSignOutAlt />, color: "slate", delay: "stagger-6" },
              { title: "LOGS", value: filteredLogs.length, icon: <FaHistory />, color: "lime", delay: "stagger-7" },
            ].map((card) => (
              <div key={card.title} className={`animate-fadeInUp opacity-0 ${card.delay}`}>
                <Card title={card.title} value={card.value} icon={card.icon} color={card.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1600px] mx-auto">
          {/* Bar Chart */}
          <div className="relative group h-[450px] rounded-[2rem] overflow-hidden animate-fadeInUp opacity-0 stagger-3">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-700" />
            <div className="noise absolute inset-0 rounded-[2rem]" />
            <div className="relative h-full glass-strong rounded-[2rem] p-8 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30" />
                  Administrative Data · {selectedYear}
                </h2>
                <span className="text-[10px] font-bold text-slate-600 bg-white/5 px-3 py-1 rounded-full">LIVE</span>
              </div>
              <div className="flex-1 min-h-0">
                <Bar data={barChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(6, 182, 212, 0.2)',
                      borderWidth: 1,
                      cornerRadius: 12,
                      padding: 12,
                      titleFont: { weight: 'bold', size: 13 },
                      bodyFont: { size: 12 },
                    },
                  },
                  scales: {
                    y: {
                      ticks: { color: '#475569', font: { size: 11 } },
                      grid: { color: 'rgba(255,255,255,0.03)' },
                      border: { display: false },
                    },
                    x: {
                      ticks: { color: '#475569', font: { size: 11, weight: 'bold' } },
                      grid: { display: false },
                      border: { display: false },
                    },
                  },
                }} />
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="relative group h-[450px] rounded-[2rem] overflow-hidden animate-fadeInUp opacity-0 stagger-4">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-700" />
            <div className="noise absolute inset-0 rounded-[2rem]" />
            <div className="relative h-full glass-strong rounded-[2rem] p-8 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30" />
                  Financial Overview · {selectedYear}
                </h2>
                <span className="text-[10px] font-bold text-slate-600 bg-white/5 px-3 py-1 rounded-full">UZS</span>
              </div>
              <div className="flex-1 min-h-0 relative">
                <Pie data={financeChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '20%',
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: '#94a3b8',
                        font: { weight: 'bold', size: 12 },
                        padding: 16,
                        usePointStyle: true,
                        pointStyleWidth: 10,
                      },
                    },
                    tooltip: {
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(168, 85, 247, 0.2)',
                      borderWidth: 1,
                      cornerRadius: 12,
                      padding: 12,
                      callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${formatUZS(ctx.raw)}`,
                      },
                    },
                  },
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
