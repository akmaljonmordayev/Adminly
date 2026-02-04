import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

const COLORS = ["#38bdf8", "#22c55e", "#ef4444", "#a855f7"];

export default function EmployeeFinanceDonut() {
  const [data, setData] = useState({
    baseSalary: 0,
    kpiAmount: 0,
    bonus: 0,
    penalty: 0,
    total: 0,
  });
  const [error, setError] = useState(null);

  // 🔑 Logged-in employee ID from localStorage
  const currentEmployeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    axios
      .get("http://localhost:5000/employees", { timeout: 5000 })
      .then((res) => {
        if (!Array.isArray(res.data) || res.data.length === 0) return;

        // 🔹 Find current employee, fallback to first employee
        const employee =
          res.data.find(
            (e) =>
              String(e._id) === currentEmployeeId ||
              String(e.id) === currentEmployeeId
          ) || res.data[0];

        const baseSalary = Number(employee.baseSalary || 0);
        const kpiAmount = Number(employee.kpiAmount || 0);
        const bonus = Number(employee.bonus || 0);
        const penalty = Number(employee.penalty || 0);
        const total = baseSalary + kpiAmount + bonus - penalty;

        setData({ baseSalary, kpiAmount, bonus, penalty, total });
        setError(null);
      })
      .catch((err) => setError("Could not load data, showing default values"));
  }, [currentEmployeeId]);

  const chartData = useMemo(
    () => ({
      labels: ["Base Salary", "KPI Amount", "Bonus", "Penalty"],
      datasets: [
        {
          data: [data.baseSalary, data.kpiAmount, data.bonus, data.penalty],
          backgroundColor: COLORS,
          borderColor: "#020617",
          borderWidth: 2,
          cutout: "70%",
        },
      ],
    }),
    [data]
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: "easeOutQuart" },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: { color: "#22d3ee", font: { weight: "bold", size: 16 } },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const percent = data.total
              ? ((value / data.total) * 100).toFixed(1)
              : 0;
            return `${label}: $${value.toLocaleString()} (${percent}%)`;
          },
        },
        backgroundColor: "#020617",
        titleColor: "#38bdf8",
        bodyColor: "#ffffff",
        borderColor: "#38bdf8",
        borderWidth: 2,
        bodyFont: { size: 14 },
      },
    },
  };

  return (
    <div className="w-[500px] h-[500px] rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center bg-gradient-to-br from-[#020617] to-[#020617ee]">
      <h2 className="text-3xl font-bold text-cyan-300 mb-4">
        My Finance Overview
      </h2>
      <p className="text-xl text-gray-300 mb-5">
        Total: ${data.total.toLocaleString()}
      </p>

      {error && (
        <p className="text-sm text-yellow-400 text-center mb-3">{error}</p>
      )}

      <div className="w-full h-full p-5 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 relative">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
