import React, { useState } from "react";
import { FaCalendarAlt  } from "react-icons/fa";
import { BsCalendar2DateFill } from "react-icons/bs";


const vacations = [
  {
    employeeId: "EMP003",
    employeeName: "Rustam K.",
    startDate: "2026-01-05",
    endDate: "2026-01-15",
    status: "pending",
  },
  {
    employeeId: "EMP004",
    employeeName: "Nilufar A.",
    startDate: "2026-02-10",
    endDate: "2026-02-20",
    status: "approved",
  },
];

function Vacations() {
  const [selectedEmployee, setSelectedEmployee] = useState(
    vacations[0].employeeName
  );

  const filteredVacations = vacations.filter(
    (v) => v.employeeName === selectedEmployee
  );

  const today = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="p-8 bg-gradient-to-br from-[#020617] to-[#020b2d] min-h-screen text-white">
      <div className="mb-10">
        <label className="block mb-2 text-cyan-300 font-semibold">
          Select Employee
        </label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="w-full md:w-[420px] bg-[#0b1220] border border-cyan-400/30 rounded-2xl px-5 py-3 shadow-lg focus:ring-2 focus:ring-cyan-400"
        >
          {[...new Set(vacations.map((v) => v.employeeName))].map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-[#0b1220] rounded-3xl p-6 flex items-center gap-5 shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:scale-[1.02] transition">
          <FaCalendarAlt className="text-4xl text-cyan-400" />
          <div>
            <p className="text-gray-400">Employment start date</p>
            <p className="text-xl font-semibold">01 Jan 2020</p>
          </div>
        </div>

        <div className="bg-[#0b1220] rounded-3xl p-6 flex items-center gap-5 shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:scale-[1.02] transition">
        <BsCalendar2DateFill className="text-cyan-400 text-4xl" />
          <div>
            <p className="text-gray-400">Today's Date</p>
            <p className="text-xl font-semibold text-white-300">{today}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0b1220] rounded-3xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-6">
          Leave History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-cyan-300">
                <th>Employee</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVacations.map((v, i) => (
                <tr
                  key={i}
                  className="bg-[#020617] rounded-xl shadow hover:bg-cyan-400/10 transition"
                >
                  <td className="py-4 px-3 rounded-l-xl">
                    {v.employeeName}
                  </td>
                  <td className="px-3">{v.startDate}</td>
                  <td className="px-3">{v.endDate}</td>
                  <td
                    className={`px-3 rounded-r-xl font-semibold ${
                      v.status === "approved"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {v.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Vacations;
