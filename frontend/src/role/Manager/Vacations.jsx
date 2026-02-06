import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaCalendarDay } from "react-icons/fa";

function Vacations() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch("http://localhost:5000/employees");
        if (!response.ok) throw new Error("Server xatosi: " + response.status);
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    setTodayDate(`${day} ${month} ${year}`);
  }, []);

  const handleChange = (e) => {
    const emp = employees.find((el) => el.id == e.target.value);
    setSelectedEmployee(emp);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedLeaves = [...selectedEmployee.leaves];
    updatedLeaves[index] = {
      ...updatedLeaves[index],
      status: newStatus,
    };
  
    setSelectedEmployee({
      ...selectedEmployee,
      leaves: updatedLeaves,
    });
  };
  

  return (
    <div className="p-10 bg-[#020617] min-h-screen text-white space-y-10">

      <div className="max-w-md">
        <label className="block mb-2 text-cyan-300 font-semibold">
          Select Employee
        </label>

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <select
          onChange={handleChange}
          className="w-full bg-[#0b1220] border border-cyan-400/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="">Select employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-10xl">
        <div className="bg-[#0b1220] rounded-2xl p-8 flex items-center gap-6 shadow-[0_0_25px_rgba(0,255,255,0.15)]">
          <FaCalendarAlt className="text-4xl text-cyan-400" />
          <div>
            <p className="text-gray-400 text-sm">Employment start date</p>
            <p className="text-2xl font-semibold">
              {selectedEmployee?.hireDate || "—"}
            </p>
          </div>
        </div>

        <div className="bg-[#0b1220] rounded-2xl p-8 flex items-center gap-6 shadow-[0_0_25px_rgba(0,255,255,0.15)]">
          <FaCalendarDay className="text-4xl text-cyan-400" />
          <div>
            <p className="text-gray-400 text-sm">Today</p>
            <p className="text-2xl font-semibold">{todayDate}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0b1220] rounded-2xl p-8 shadow-[0_0_30px_rgba(0,255,255,0.15)] max-w-10xl mx-auto">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-6">
          Leave History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0a101f] sticky top-0">
              <tr>
                <th className="py-4 px-4 text-cyan-300 border-b border-cyan-400/20">
                  Leave Type
                </th>
                <th className="py-4 px-4 text-cyan-300 border-b border-cyan-400/20">
                  Start Date
                </th>
                <th className="py-4 px-4 text-cyan-300 border-b border-cyan-400/20">
                  End Date
                </th>
                <th className="py-4 px-4 text-cyan-300 border-b border-cyan-400/20">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-300">
              {selectedEmployee?.leaves?.length ? (
                selectedEmployee.leaves.map((leave, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-cyan-400/5 transition"
                  >
                    <td className="py-4 px-4 font-semibold">
                      {leave.leaveType}
                    </td>
                    <td className="px-4">{leave.startDate}</td>
                    <td className="px-4">{leave.endDate}</td>
                    <td className="px-4">
                    <select
                      value={leave.status || "Pending"}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                      className={`px-3 py-1 rounded-md font-semibold outline-none
                        ${
                          leave.status === "Approved"
                            ? "bg-green-500/20 text-green-400"
                            : leave.status === "Rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                    >
                      <option value="Pending" className="bg-[#0b1220] text-yellow-400">
                        Pending
                      </option>
                      <option value="Approved" className="bg-[#0b1220] text-green-400">
                        Approved
                      </option>
                      <option value="Rejected" className="bg-[#0b1220] text-red-400">
                        Rejected
                      </option>
                    </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-gray-400 text-lg"
                  >
                    No leave data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Vacations;
