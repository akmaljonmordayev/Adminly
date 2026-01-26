import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import {
  FaUsers,
  FaTasks,
  FaBullhorn,
  FaExclamationCircle,
  FaArchive,
} from "react-icons/fa";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";

function Dashboard() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [allArchieve1, setAllArchieve1] = useState([]);
  const [allArchieve2, setAllArchieve2] = useState([]);
  const [allArchieve3, setAllArchieve3] = useState([]);
  const [allArchieve4, setAllArchieve4] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [allAnnouncements, setAllAnnouncements] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/employees")
      .then((res) => setAllEmployees(res.data));
    axios
      .get("http://localhost:5000/tasks")
      .then((res) => setAllTasks(res.data));
    axios
      .get("http://localhost:5000/complaints")
      .then((res) => setAllComplaints(res.data));
    axios
      .get("http://localhost:5000/announcements")
      .then((res) => setAllAnnouncements(res.data));

    axios
      .get("http://localhost:5000/employeesDeleted")
      .then((res) => setAllArchieve1(res.data));
    axios
      .get("http://localhost:5000/tasksDeleted")
      .then((res) => setAllArchieve2(res.data));
    axios
      .get("http://localhost:5000/complaintsDeleted")
      .then((res) => setAllArchieve3(res.data));
    axios
      .get("http://localhost:5000/announcementsDeleted")
      .then((res) => setAllArchieve4(res.data));
  }, []);

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
          allArchieve1.length +
            allArchieve2.length +
            allArchieve3.length +
            allArchieve4.length,
          4,
          6,
          10,
        ],
        backgroundColor: [
          "rgba(0, 200, 255, 0.6)",
          "rgba(155, 89, 182, 0.6)",
          "rgba(231, 76, 60, 0.6)",
          "rgba(52, 152, 219, 0.6)",
          "rgba(241, 196, 15, 0.6)",
          "rgba(46, 204, 113, 0.6)",
          "rgba(149, 165, 166, 0.6)",
          "rgba(105, 229, 16, 0.901)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#ffffff",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#111827",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#00c8ff",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#9ca3af",
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#9ca3af",
          beginAtZero: true,
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };

  const allSalary = allEmployees.reduce((prev, current) => {
    return prev + Number(current.baseSalary);
  }, 0);
  const allBonus = allEmployees.reduce((prev, current) => {
    return prev + Number(current.bonus);
  }, 0);
  const allPenalty = allEmployees.reduce((prev, current) => {
    return prev + Number(current.penalty);
  }, 0);
  const allKpiAmount = allEmployees.reduce((prev, current) => {
    return prev + Number(current.kpiAmount);
  }, 0);
  console.log(allSalary);

  const barChartDataEmployees = {
    labels: ["TotalSalary", "Bonus", "Penalty", "KpiAmount"],
    datasets: [
      {
        label: "Finance Statistics",
        data: [allSalary, allBonus, allPenalty, allKpiAmount],
        backgroundColor: [
          "rgba(38, 0, 255, 0.6)",
          "rgba(89, 182, 94, 0.6)",
          "rgba(216, 41, 21, 0.6)",
          "rgba(52, 152, 219, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div className="p-8 bg-[#070B18]">
        <h1 className="text-2xl font-semibold text-cyan-400 mb-6">
          Dashboard Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <Card
            title="Employees"
            value={allEmployees.length}
            icon={<FaUsers />}
            color="cyan"
          />
          <Card
            title="Tasks"
            value={allTasks.length}
            icon={<FaTasks />}
            color="purple"
          />
          <Card
            title="Complaints"
            value={allComplaints.length}
            icon={<FaExclamationCircle />}
            color="red"
          />
          <Card
            title="Announcements"
            value={allAnnouncements.length}
            icon={<FaBullhorn />}
            color="blue"
          />
          <Card
            title="Archive"
            value={
              allArchieve1.length +
              allArchieve2.length +
              allArchieve3.length +
              allArchieve4.length
            }
            icon={<FaArchive />}
            color="yellow"
          />
        </div>
      </div>

      <div className="flex">
        <div style={{ width: "50%", height: "400px" }}>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
        <div style={{ width: "50%", height: "400px" }}>
          <Pie data={barChartDataEmployees} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
