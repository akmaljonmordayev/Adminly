import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

export default function EmployeeLineAnalytics() {
  const [chartDataAPI, setChartDataAPI] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/employeeFinance");
  
        console.log("API:", res.data);
  
        const employee = res.data.find(e => e.employeeId === "1");
        if (!employee) return;
  
        const monthly = employee.monthly;
  
        const salary = monthly.map(m => m.baseSalary);
        const kpi = monthly.map(m => m.kpiAmount);
        const bonus = monthly.map(m => m.bonus);
        const penalty = monthly.map(m => m.penalty);
  
        const formatted = { salary, kpi, bonus, penalty };
  
        setChartDataAPI(formatted);

        let sum = 0;
        monthly.forEach(m => {
          sum += m.totalSalary;
        });
  
        setTotal(sum);
  
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchData();
  }, []);
  


  const data = useMemo(() => {
    if (!chartDataAPI) return { labels: [], datasets: [] };

    return {
      labels: months,
      datasets: [
        {
          label: "Salary",
          data: chartDataAPI.salary,
          borderColor: "#06b6d4",
          backgroundColor: "#06b6d4",
          tension: 0.4,
          pointRadius: 4,
        },
        {
          label: "KPI",
          data: chartDataAPI.kpi,
          borderColor: "#22c55e",
          backgroundColor: "#22c55e",
          tension: 0.4,
          pointRadius: 4,
        },
        {
          label: "Bonus",
          data: chartDataAPI.bonus,
          borderColor: "#f59e0b",
          backgroundColor: "#f59e0b",
          tension: 0.4,
          pointRadius: 4,
        },
        {
          label: "Penalty",
          data: chartDataAPI.penalty,
          borderColor: "#ef4444",
          backgroundColor: "#ef4444",
          tension: 0.4,
          pointRadius: 4,
        },
      ],
    };
  }, [chartDataAPI]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        labels: { color: "#cbd5e1", font:{size:14,weight:"bold"} }
      },
      tooltip: {
        backgroundColor: "#020617",
        borderColor: "#06b6d4",
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: $${ctx.raw}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#94a3b8" },
        grid: { color: "#0f172a" }
      },
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "#020617" }
      }
    }
  };

  return (
    <div className="w-8xl h-full bg-[#020617] flex flex-col items-center p-6">

      <h1 className="text-3xl font-bold text-cyan-400 mb-2">
      📈 Employee Profit Analytics
      </h1>

      <div className="text-center mb-4">
        <div className="text-slate-400 text-sm">TOTAL PROFIT</div>
        <div className="text-4xl text-cyan-400 font-bold">${total}</div>
      </div>

      <div className="w-full h-full bg-[#020617]/70 border border-cyan-900 rounded-2xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
        <Line data={data} options={options}/>
      </div>

    </div>
  );
}
