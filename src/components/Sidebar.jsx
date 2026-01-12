import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import React from 'react'
import {
  MdDashboard,
  MdPeople,
  MdTask,
  MdReport,
  MdAttachMoney,
  MdSettings,
  MdArchive,
  MdAnnouncement,
  MdBeachAccess,
  MdHistory,
} from 'react-icons/md'
import { FaUserCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Sidebar() {
  const location = useLocation()
  const [active, setActive] = useState(location.pathname.slice(9))

  console.log(location.pathname)

  useEffect(() => {
    const url = location.pathname.slice(9)
    setActive(url)
  }, [location.pathname])

  const menu = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <MdDashboard />,
      link: '/manager/dashboard',
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: <MdPeople />,
      link: '/manager/employees',
    },
    { id: 'tasks', label: 'Tasks', icon: <MdTask />, link: '/manager/tasks' },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: <MdReport />,
      link: '/manager/complaints',
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: <MdAttachMoney />,
      link: '/manager/finance',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <MdSettings />,
      link: '/manager/settings',
    },
    {
      id: 'archieve',
      label: 'Archieve',
      icon: <MdArchive />,
      link: '/manager/archieve',
    },
    {
      id: 'announcemenets',
      label: 'Announcemenets',
      icon: <MdAnnouncement />,
      link: '/manager/announcemenets',
    },
    {
      id: 'vacations',
      label: 'Vacations',
      icon: <MdBeachAccess />,
      link: '/manager/vacations',
    },
    {
      id: 'leaves',
      label: 'Leaves',
      icon: <MdBeachAccess />,
      link: '/manager/leaves',
    },
    {
      id: 'logs',
      label: 'Audit Logs',
      icon: <MdHistory />,
      link: '/manager/logs',
    },
  ]

  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'Guest',
    role: 'Manager',
  }

  return (
    <aside className="w-[280px]  bg-[#0b1220] text-white p-6 flex flex-col shadow-[0_0_50px_rgba(0,255,255,0.2)]">
      <div>
        <h1 className="text-3xl font-bold text-cyan-400 flex items-center gap-3 mb-8">
          <MdDashboard className="text-cyan-300" />
          Adminly
        </h1>

        <div className="flex items-center gap-3 mb-10 p-3 rounded-xl bg-cyan-500/10 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
          <FaUserCircle className="text-5xl text-cyan-400" />
          <div>
            <p className="font-semibold text-white">{user.name}</p>
            <p className="text-sm text-cyan-200">{user.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-3">
        {menu.map((item) => {
          const isActive = active === item.id
          return (
            <Link
              key={item.id}
              to={item.link}
              onClick={() => setActive(item.id)}
            >
              <div
                className={`flex items-center gap-4 px-5 py-3 cursor-pointer transition-all duration-300
                  ${
                    isActive
                      ? 'bg-cyan-400/20 text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)] font-semibold rounded-xl'
                      : 'text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-300 rounded-xl hover:translate-x-1'
                  }
                `}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-md">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
