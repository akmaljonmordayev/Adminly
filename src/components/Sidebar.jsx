import { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import React from 'react'
import {
  FiGrid, FiUsers, FiDollarSign, FiCheckSquare, FiMessageSquare,
  FiZap, FiCompass, FiSettings, FiArchive, FiClock, FiActivity,
  FiChevronLeft, FiChevronRight, FiLogOut
} from 'react-icons/fi'

function Sidebar({ isCollapsed, onToggle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [active, setActive] = useState(location.pathname)

  useEffect(() => {
    setActive(location.pathname)
  }, [location.pathname])

  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiGrid />, link: '/manager/dashboard' },
    { id: 'employees', label: 'Employees', icon: <FiUsers />, link: '/manager/employees' },
    { id: 'finance', label: 'Finance', icon: <FiDollarSign />, link: '/manager/finance' },
    { id: 'tasks', label: 'Tasks', icon: <FiCheckSquare />, link: '/manager/tasks' },
    { id: 'complaints', label: 'Complaints', icon: <FiMessageSquare />, link: '/manager/complaints' },
    { id: 'announcements', label: 'Announcements', icon: <FiZap />, link: '/manager/announcemenets' },
    { id: 'vacations', label: 'Vacations', icon: <FiCompass />, link: '/manager/vacations' },
    { id: 'leaves', label: 'Leaves', icon: <FiActivity />, link: '/manager/leaves' },
    { id: 'archive', label: 'Archive', icon: <FiArchive />, link: '/manager/archieve' },
    { id: 'logs', label: 'Audit Logs', icon: <FiClock />, link: '/manager/logs' },
    { id: 'settings', label: 'Settings', icon: <FiSettings />, link: '/manager/settings' },
  ]

  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'Admin User',
    role: 'System Manager',
  }

  return (
    <aside
      className={`
        h-screen flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        bg-[var(--bg-secondary)] border-r border-white/5 relative z-20
        ${isCollapsed ? 'w-20' : 'w-[280px]'}
      `}
    >
      {/* Brand Logo */}
      <div className={`h-20 flex items-center mb-6 px-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group cursor-pointer active:scale-90 transition-transform">
            <FiZap className="text-white text-xl group-hover:rotate-12 transition-transform" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-black italic tracking-tighter text-[var(--text-primary)]">
              ADMIN<span className="text-cyan-500">LY</span>
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar py-2">
        {menu.map((item) => {
          const isActive = active === item.link || active.startsWith(item.link + '/')
          return (
            <Link
              key={item.id}
              to={item.link}
              className="block group"
            >
              <div
                className={`
                  relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
                  ${isActive
                    ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400 font-bold'
                    : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-cyan-500 rounded-r-full shadow-[0_0_15px_#22d3ee]" />
                )}

                <span className={`text-xl transition-all duration-300 ${isActive ? 'scale-110 rotate-0' : 'group-hover:scale-110 group-hover:-rotate-6 opacity-70 group-hover:opacity-100'}`}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="text-[13px] tracking-wide uppercase font-black opacity-90 group-hover:translate-x-1 transition-transform">
                    {item.label}
                  </span>
                )}

                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-2xl border border-white/10">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User Footer */}
      <div className="mt-auto p-4 border-t border-white/5 bg-black/5">
        <div
          onClick={() => navigate('/manager/settings')}
          className={`
            flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all
            hover:bg-white/5 active:scale-95
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-cyan-400 font-black shadow-xl">
              {user.name[0]}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[var(--bg-secondary)] rounded-full animate-pulse" />
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-[var(--text-primary)] truncate uppercase tracking-tighter">{user.name}</p>
              <p className="text-[9px] font-black text-cyan-500/60 uppercase tracking-widest truncate">{user.role}</p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={() => {
              localStorage.clear()
              navigate('/auth/signin')
            }}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/5 text-[10px] font-black text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all uppercase tracking-[0.2em]"
          >
            <FiLogOut /> Sign Out
          </button>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
