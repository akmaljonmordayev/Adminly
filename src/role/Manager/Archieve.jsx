import React from "react";

function Archieve() {
  return (
    <>
      <nav class="bg-[#0b1220] text-white w-100% min-h-50px p-5 rounded-xl mt-2">
        <ul class="flex gap-6">
          <li class="px-4 py-2 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-300 rounded-xl cursor-pointer">
            Dashboard
          </li>
          <li class="px-4 py-2 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-300 rounded-xl cursor-pointer">
            Employees
          </li>
          <li class="px-4 py-2 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-300 rounded-xl cursor-pointer">
            Tasks
          </li>
          <li class="px-4 py-2 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-300 rounded-xl cursor-pointer">
            Complaints
          </li>
          <li class="px-4 py-2 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-300 rounded-xl cursor-pointer">
            Finance
          </li>
          <li class="px-4 py-2 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-300 rounded-xl cursor-pointer">
            Announcements
          </li>
          <li class="px-4 py-2 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-300 rounded-xl cursor-pointer">
            Leaves / Vacations
          </li>
          <li class="px-4 py-2 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-300 rounded-xl cursor-pointer">
            Logs
          </li>
        </ul>
      </nav>
      <section class="bg-[#0b1220] text-white w-100% min-h-140 p-5 rounded-xl mt-2">
        <p>Archieve</p>
      </section>
    </>
  );
}

export default Archieve;
