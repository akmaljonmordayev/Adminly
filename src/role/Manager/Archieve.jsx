import React from 'react'
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
function Archieve() {
  return (
    <>
      <nav class="bg-[#0b1220] text-white w-100% min-h-50px p-5 rounded-xl mt-2">
        <ul class="flex gap-6">
          <Link to={'/manager/archieve/employeesArchieve'}>
            <li class="px-4 py-2 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-300 rounded-xl cursor-pointer">
              Employees
            </li>
          </Link>
          <Link to={'/manager/archieve/tasksArchieve'}>
            <li class="px-4 py-2 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-300 rounded-xl cursor-pointer">
              Tasks
            </li>
          </Link>
          <Link to={'/manager/archieve/complaintsArchieve'}>
            <li class="px-4 py-2 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-300 rounded-xl cursor-pointer">
              Complaints
            </li>
          </Link>
          <Link to={'/manager/archieve/announcementsArchieve'}>
            <li class="px-4 py-2 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-300 rounded-xl cursor-pointer">
              Announcements
            </li>
          </Link>
        </ul>
      </nav>
      <section class="bg-[#0b1220] text-white w-100% min-h-140 p-5 rounded-xl mt-2">
        <Outlet />
      </section>
    </>
  )
}

export default Archieve
