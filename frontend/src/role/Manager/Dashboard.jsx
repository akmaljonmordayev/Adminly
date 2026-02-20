import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import {
  FaUsers,
  FaTasks,
  FaBullhorn,
  FaExclamationCircle,
  FaArchive,
  FaSignOutAlt,
  FaHistory,
} from "react-icons/fa";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";

function Dashboard() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [allArchieve1, setAllArchieve1] = useState([]);
  const [allArchieve2, setAllArchieve2] = useState([]);
  const [allArchieve3, setAllArchieve3] = useState([]);
  const [allArchieve4, setAllArchieve4] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const [allVacations, setAllVacations] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [allLogs, setAllLogs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/employees").then(r => setAllEmployees(r.data));
    axios.get("http://localhost:5000/tasks").then(r => setAllTasks(r.data));
    axios.get("http://localhost:5000/complaints").then(r => setAllComplaints(r.data));
    axios.get("http://localhost:5000/announcements").then(r => setAllAnnouncements(r.data));
    axios.get("http://localhost:5000/employeesDeleted").then(r => setAllArchieve1(r.data));
    axios.get("http://localhost:5000/tasksDeleted").then(r => setAllArchieve2(r.data));
    axios.get("http://localhost:5000/complaintsDeleted").then(r => setAllArchieve3(r.data));
    axios.get("http://localhost:5000/announcementsDeleted").then(r => setAllArchieve4(r.data));
    axios.get("http://localhost:5000/vacations").then(r => setAllVacations(r.data));
    axios.get("http://localhost:5000/resignations").then(r => setAllLeaves(r.data));
    axios.get("http://localhost:5000/employeeFinance").then(r => setAllLeaves(r.data));
    axios.get("http://localhost:5000/logs").then(r => setAllLogs(r.data));
  }, []);

  const archiveCount =
    allArchieve1.length +
    allArchieve2.length +
    allArchieve3.length +
    allArchieve4.length;

 

  const barChartData = {
    labels: [
      "Employees",
      "Tasks",
      "Complaints",
      "Announcements",
      "Archive",
      "Vacations",
      "Leaves",
      "Logs",
    ],
    datasets: [
      {
        label: "Adminly Statistics",
        data: [
          allEmployees.length,
          allTasks.length,
          allComplaints.length,
          allAnnouncements.length,
          archiveCount,
          allVacations.length,
          allLeaves.length,
          allLogs.length,
        ],
        backgroundColor: [
          "#22d3ee",
          "#a855f7",
          "#ef4444",
          "#3b82f6",
          "#facc15",
          "#10b981",
          "#94a3b8",
          "#84cc16",
        ],
        borderRadius: 12,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#22d3ee",
          font: { size: 14, weight: "bold" },
        },
      },
      tooltip: {
        backgroundColor: "#020617",
        titleColor: "#22d3ee",
        bodyColor: "#ffffff",
        borderColor: "#22d3ee",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: "#e5e7eb" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#e5e7eb", beginAtZero: true },
        grid: { color: "rgba(255,255,255,0.08)" },
      },
    },
  };

 

  const allSalary = allEmployees.reduce((p, c) => p + Number(c.baseSalary), 0);
  const allBonus = allEmployees.reduce((p, c) => p + Number(c.bonus), 0);
  const allPenalty = allEmployees.reduce((p, c) => p + Number(c.penalty), 0);
  const allKpiAmount = allEmployees.reduce((p, c) => p + Number(c.kpiAmount), 0);

  const financeChartData = {
    labels: ["Salary", "Bonus", "Penalty", "KPI"],
    datasets: [
      {
        data: [allSalary, allBonus, allPenalty, allKpiAmount],
        backgroundColor: ["#38bdf8", "#22c55e", "#ef4444", "#a855f7"],
        borderColor: "#020617",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-10 bg-gradient-to-br from-[#020617] to-[#020617ee] min-h-screen">
      <h1 className="text-3xl font-bold text-cyan-400 mb-8">
        Dashboard Overview
      </h1>

    
      <div className="relative -mx-2 px-2">
        <div className="
          flex gap-10 py-10 px-6 overflow-x-auto no-scrollbar
        ">
          <Card title="Employees" value={allEmployees.length} icon={<FaUsers />} color="cyan" />
          <Card title="Tasks" value={allTasks.length} icon={<FaTasks />} color="purple" />
          <Card title="Complaints" value={allComplaints.length} icon={<FaExclamationCircle />} color="red" />
          <Card title="Announcements" value={allAnnouncements.length} icon={<FaBullhorn />} color="blue" />
          <Card title="Archive" value={archiveCount} icon={<FaArchive />} color="yellow" />
          <Card title="Leaves" value={allLeaves.length} icon={<FaSignOutAlt />} color="green" />
          <Card title="Logs" value={allLogs.length} icon={<FaHistory />} color="purple" />
        </div>
      </div>

    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="h-[420px] rounded-2xl p-8 pb-[55px] bg-white/5 border border-white/10 backdrop-blur-xl">
          <h2 className="text-cyan-300 mb-4 font-semibold">
            Adminly Statistics
          </h2>
          <Bar data={barChartData} options={chartOptions} />
        </div>

        <div className="h-[420px] rounded-2xl p-8 pb-[55px] bg-white/5 border border-white/10 backdrop-blur-xl">
          <h2 className="text-cyan-300 mb-4 font-semibold">
            Finance Overview
          </h2>
          <Pie data={financeChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
