import React, { useState, useEffect } from 'react'
import Card from '../../components/Card'
import {
  FaUsers,
  FaTasks,
  FaBullhorn,
  FaExclamationCircle,
  FaArchive,
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

  // Filter everything by Selected Year
  const filteredTasks = allTasks.filter(t => t.deadline.startsWith(selectedYear))
  const filteredComplaints = allComplaints.filter(c => c.date.startsWith(selectedYear))
  const filteredAnnouncements = allAnnouncements.filter(a => a.date.startsWith(selectedYear))
  const filteredVacations = allVacations.filter(v => v.startDate.startsWith(selectedYear))
  const filteredLeaves = allLeaves.filter(l => l.appliedDate.startsWith(selectedYear))
  const filteredLogs = allLogs.filter(log => log.date.startsWith(selectedYear))

  // Archive data usually has no year, so we show it all or filter if possible
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
        backgroundColor: ['#a855f7', '#ef4444', '#3b82f6', '#10b981', '#94a3b8', '#84cc16'],
        borderRadius: 12,
      },
    ],
  }

  const financeChartData = {
    labels: ['Salary', 'Bonus', 'Penalty', 'KPI'],
    datasets: [
      {
        data: [allSalary, allBonus, allPenalty, allKpiAmount],
        backgroundColor: ['#06b6d4', '#22c55e', '#ef4444', '#a855f7'],
        borderColor: '#020617',
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="p-10 bg-[#020617] min-h-screen">
      <div className="flex justify-between items-center mb-10 max-w-[1600px] mx-auto">
        <h1 className="text-4xl font-black text-cyan-400 italic tracking-tighter">
          OVERVIEW <span className="text-white">DASHBOARD</span>
        </h1>

        <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10">
          {['2025', '2026'].map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${selectedYear === y
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              {y} Year
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto overflow-x-auto no-scrollbar pb-10">
        <div className="flex gap-8 mb-10 min-w-max px-4">
          <Card title="EMPLOYEES" value={allEmployees.length} icon={<FaUsers />} color="cyan" />
          <Card title="ACTIVE TASKS" value={filteredTasks.length} icon={<FaTasks />} color="purple" />
          <Card title="COMPLAINTS" value={filteredComplaints.length} icon={<FaExclamationCircle />} color="red" />
          <Card title="ANNOUNCEMENTS" value={filteredAnnouncements.length} icon={<FaBullhorn />} color="blue" />
          <Card title="VACATIONS" value={filteredVacations.length} icon={<FaUmbrellaBeach />} color="green" />
          <Card title="RESIGNATIONS" value={filteredLeaves.length} icon={<FaSignOutAlt />} color="slate" />
          <Card title="SYSTEM LOGS" value={filteredLogs.length} icon={<FaHistory />} color="lime" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-[1600px] mx-auto">
        <div className="h-[450px] rounded-[3rem] p-10 bg-slate-900/40 border border-slate-800 backdrop-blur-xl flex flex-col">
          <h2 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500" /> Administrative Statistics {selectedYear}
          </h2>
          <div className="flex-1 min-h-0">
            <Bar data={barChartData} options={{
              responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
              scales: { y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#64748b' }, grid: { display: false } } }
            }} />
          </div>
        </div>

        <div className="h-[450px] rounded-[3rem] p-10 bg-slate-900/40 border border-slate-800 backdrop-blur-xl flex flex-col">
          <h2 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> Financial Overview {selectedYear}
          </h2>
          <div className="flex-1 min-h-0 relative">
            <Pie data={financeChartData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'right', labels: { color: '#94a3b8', font: { weight: 'bold' }, padding: 20 } }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${formatUZS(ctx.raw)}` } } }
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
