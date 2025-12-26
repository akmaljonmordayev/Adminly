import React from "react";
import {
  FaCalendarAlt,
  FaCalendarMinus,
  FaCalendarCheck,
  FaPlus,
} from "react-icons/fa";

function Vacations() {
  return (
    <div className="p-8 bg-[#020617] min-h-screen text-white">
      <div className="mb-8">
        <label className="block mb-2 text-cyan-300 font-semibold">
          Select Employee
        </label>
        <select className="w-full md:w-[400px] bg-[#0b1220] border border-cyan-400/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white">
          <option>Xojarxon Xaydarova</option>
          <option>Akmaljon Mordayev</option>
          <option>Mohinur Sulaymonqulova</option>
          <option>Muhammadqodir Shukuriddinov</option>
          <option>MuhammadAli Baxtiyorov</option>
          <option>Akrom Ziyayev</option>
          <option>Azamat Xamidullayev</option>
          <option>Abdulloh Abdumalikov</option>
          <option>Bilol Botov</option>
          <option>Abdulaziz Xusanov</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#0b1220] rounded-2xl p-6 flex items-center gap-4 shadow-[0_0_20px_rgba(0,255,255,0.15)]">
          <FaCalendarAlt className="text-3xl text-cyan-400" />
          <div>
            <p className="text-gray-400">Employment start date</p>
            <p className="text-lg font-semibold">01 Jan 2020</p>
          </div>
        </div>

        <div className="bg-[#0b1220] rounded-2xl p-6 flex items-center gap-4 shadow-[0_0_20px_rgba(0,255,255,0.15)]">
          <FaCalendarMinus className="text-3xl text-red-400" />
          <div>
            <p className="text-gray-400">Employment end date</p>
            <p className="text-lg font-semibold">03 Mar 2030</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0b1220] rounded-2xl p-6 shadow-[0_0_25px_rgba(0,255,255,0.15)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-cyan-400">
            Leave History
          </h2>

        
        </div>

        <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
  <table className="w-full text-left">
    <thead className="sticky top-0 bg-[#0b1220] z-10">
      <tr className="text-cyan-300 border-b border-cyan-400/20">
        <th className="py-3">Leave Type</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody className="text-gray-300">
    <tr className="border-b border-gray-700 hover:bg-cyan-400/5">
                <td className="py-3">Unpaid Leave</td>
                <td>08 Dec 2021</td>
                <td>12 Dec 2021</td>
                <td className="text-green-400">Approved</td>
              </tr>

              <tr className="border-b border-gray-700 hover:bg-cyan-400/5">
                <td className="py-3">Sick Leave</td>
                <td>23 May 2022</td>
                <td>28 May 2022</td>
                <td className="text-green-400">Approved</td>
              </tr>

              <tr className="hover:bg-cyan-400/5">
                <td className="py-3">Annual Leave</td>
                <td>15 Sep 2023</td>
                <td>17 Sep 2023</td>
                <td className="text-yellow-400">Pending</td>
              </tr>
    </tbody>
  </table>
</div>
        
      </div>
    </div>
  );
}

export default Vacations;
