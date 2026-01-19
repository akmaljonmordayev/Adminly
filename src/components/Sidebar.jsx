import { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
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
  MdPersonOff,
} from 'react-icons/md'
import { FaUserCircle } from 'react-icons/fa'

function Sidebar({ isCollapsed }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [active, setActive] = useState(location.pathname.slice(9))

  useEffect(() => {
    setActive(location.pathname.slice(9))
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
    {
      id: 'finance',
      label: 'Finance',
      icon: <MdAttachMoney />,
      link: '/manager/finance',
    },
    { id: 'tasks', label: 'Tasks', icon: <MdTask />, link: '/manager/tasks' },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: <MdReport />,
      link: '/manager/complaints',
    },
    {
      id: 'announcemenets',
      label: 'Announcements',
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
      icon: <MdPersonOff />,
      link: '/manager/leaves',
    },
    {
      id: 'archieve',
      label: 'Archieve',
      icon: <MdArchive />,
      link: '/manager/archieve',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <MdSettings />,
      link: '/manager/settings',
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
    <aside
      className={`
        min-h-screen flex flex-col transition-all duration-300 border-r border-white/5 
        bg-gradient-to-b from-[#020617] to-[#020617ee] shadow-[6px_0_30px_rgba(2,6,23,0.9)]
        ${isCollapsed ? 'w-20 p-4' : 'w-[280px] p-6'}
      `}
    >
      <h1
        className={`text-3xl font-bold text-cyan-400 flex items-center gap-3 mb-10 tracking-wide ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        <MdDashboard className="text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] flex-shrink-0" />
        {!isCollapsed && <span>Adminly</span>}
      </h1>

      <div
        onClick={() => navigate('/manager/settings')}
        className={`
          flex items-center gap-3 mb-12 p-4 rounded-2xl bg-white/5 border border-white/10
          shadow-[0_0_20px_rgba(0,0,0,0.6)] cursor-pointer hover:bg-white/10 transition-all
          ${isCollapsed ? 'justify-center' : ''}
        `}
      >
        <FaUserCircle className="text-4xl text-cyan-400 flex-shrink-0" />
        {!isCollapsed && (
          <div className="overflow-hidden">
            <p className="font-semibold truncate text-white">{user.name}</p>
            <p className="text-sm text-cyan-300 truncate">{user.role}</p>
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => {
          const isActive = active === item.id
          return (
            <Link
              key={item.id}
              to={item.link}
              title={isCollapsed ? item.label : ''}
            >
              <div
                className={`
                  relative flex items-center gap-4 px-5 py-3 transition-all duration-300
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-400/20 to-transparent text-cyan-300 font-semibold rounded-xl border-l-4 border-cyan-400'
                      : 'text-gray-400 hover:bg-white/5 hover:text-cyan-300 rounded-xl hover:translate-x-1'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-xl blur-md bg-cyan-400/10"></span>
                )}

                <span
                  className={`relative text-2xl flex-shrink-0 ${
                    isActive ? 'text-cyan-300' : 'text-gray-500'
                  }`}
                >
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="relative text-md">{item.label}</span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
