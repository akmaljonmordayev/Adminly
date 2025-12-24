import React from "react";
import {
  FaCalendarAlt,
  FaCalendarMinus,
  FaCalendarCheck,
} from "react-icons/fa";
import { MdWarning } from "react-icons/md";

function Vacations() {
  return (
    <div className="p-8 bg-[#020617] min-h-screen text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0b1220] rounded-2xl p-6 flex items-center gap-5 shadow-[0_0_20px_rgba(0,255,255,0.15)]">
          <FaCalendarAlt className="text-4xl text-cyan-400" />
          <div>
            <p className="text-gray-400">Total Leaves</p>
            <p className="text-2xl font-bold text-cyan-300">25 Days</p>
          </div>
        </div>

        <div className="bg-[#0b1220] rounded-2xl p-6 flex items-center gap-5 shadow-[0_0_20px_rgba(0,255,255,0.15)]">
          <FaCalendarMinus className="text-4xl text-yellow-400" />
          <div>
            <p className="text-gray-400">Used</p>
            <p className="text-2xl font-bold text-yellow-300">12 Days</p>
          </div>
        </div>

        <div className="bg-[#0b1220] rounded-2xl p-6 flex items-center gap-5 shadow-[0_0_20px_rgba(0,255,255,0.15)]">
          <FaCalendarCheck className="text-4xl text-green-400" />
          <div>
            <p className="text-gray-400">Remaining</p>
            <p className="text-2xl font-bold text-green-300">13 Days</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-[#0b1220] rounded-2xl p-6 shadow-[0_0_25px_rgba(0,255,255,0.15)]">
          <h2 className="text-xl font-semibold text-cyan-400 mb-3">
            Pending Requests
          </h2>
          <p className="text-cyan-300 mb-4">3 Awaiting Approval</p>

          <ul className="space-y-2 text-gray-300">
            <li className="bg-cyan-400/10 rounded-lg px-4 py-2">
              Xaydarova Xojarxon
            </li>
            <li className="bg-cyan-400/10 rounded-lg px-4 py-2">
              Sulaymonqulova Mohinur
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2 bg-[#0b1220] rounded-2xl p-6 shadow-[0_0_25px_rgba(0,255,255,0.15)]">
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">
            Leave History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-cyan-300 border-b border-cyan-400/20">
                  <th className="py-3">Name</th>
                  <th>Leave Type</th>
                  <th>Dates</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-700 hover:bg-cyan-400/5">
                  <td className="py-3">Aliyeva Nilufar</td>
                  <td>Annual Leave</td>
                  <td>May 10 - May 15</td>
                </tr>
                <tr className="border-b border-gray-700 hover:bg-cyan-400/5">
                  <td className="py-3">Usmonov Kamol</td>
                  <td>Sick Leave</td>
                  <td>May 12 - May 14</td>
                </tr>
                <tr className="hover:bg-cyan-400/5">
                  <td className="py-3">Karimova Shoxida</td>
                  <td>Unpaid Leave</td>
                  <td>May 8 - May 12</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-[#0b1220] rounded-2xl p-6 flex items-start gap-4 shadow-[0_0_25px_rgba(255,0,0,0.15)]">
        <MdWarning className="text-4xl text-red-400 mt-1" />
        <div>
          <h3 className="text-lg font-semibold text-red-400">Alerts</h3>
          <p className="text-gray-300">
            Sales Team: Multiple Leaves Overlapping!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Vacations;
