import { useTheme } from '../../context/ThemeContext';
import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineExclamationCircle,
  HiOutlineSpeakerphone,
} from 'react-icons/hi'
import { FiArchive, FiArrowRight } from 'react-icons/fi'

function Archieve() {
  const { pathname } = useLocation()
  const { isDarkMode } = useTheme()

  const isActive = (path) => pathname === path

  const navItems = [
    {
      name: 'Employees',
      path: '/manager/archieve/employeesArchieve',
      icon: <HiOutlineUsers />,
      color: 'from-blue-500 to-cyan-400'
    },
    {
      name: 'Tasks',
      path: '/manager/archieve/tasksArchieve',
      icon: <HiOutlineClipboardList />,
      color: 'from-purple-500 to-indigo-400'
    },
    {
      name: 'Complaints',
      path: '/manager/archieve/complaintsArchieve',
      icon: <HiOutlineExclamationCircle />,
      color: 'from-red-500 to-rose-400'
    },
    {
      name: 'Announcements',
      path: '/manager/archieve/announcementsArchieve',
      icon: <HiOutlineSpeakerphone />,
      color: 'from-amber-500 to-orange-400'
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8 text-[var(--text-primary)] antialiased transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeInUp">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                <FiArchive size={20} />
              </div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">System</span> Archive
              </h1>
            </div>
            <p className="text-[var(--text-secondary)] text-xs font-bold tracking-[0.3em] uppercase opacity-60 ml-1">
              Restore or permanently clear historical data
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
            <div className="text-right">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest leading-none mb-1">Backup Status</p>
              <p className="text-xs font-bold text-[var(--text-primary)]">Automatically Synced</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="glass-strong border border-white/10 p-2 rounded-[2.5rem] shadow-2xl animate-fadeInUp stagger-1 opacity-0">
          <ul className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <li key={item.path} className="flex-1 min-w-[120px]">
                <Link
                  to={item.path}
                  className={`
                    relative flex items-center justify-center gap-3 px-6 py-4 rounded-[2rem] transition-all duration-300 group overflow-hidden
                    ${isActive(item.path)
                      ? 'text-[var(--text-primary)] shadow-lg'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                    }
                  `}
                >
                  {/* Active Indicator Background */}
                  {isActive(item.path) && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20`} />
                  )}
                  {isActive(item.path) && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-b-full shadow-[0_2px_10px_rgba(34,211,238,0.5)]" />
                  )}

                  <span className={`text-xl transition-transform duration-300 group-hover:scale-110 ${isActive(item.path) ? 'text-cyan-400' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-black tracking-tight uppercase">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content Container */}
        <main className="relative animate-fadeInUp stagger-2 opacity-0">
          {/* Decorative reflections */}
          <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-cyan-900/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

          <section
            className="
            relative z-10 
            bg-[var(--bg-secondary)]/80 backdrop-blur-3xl
            border border-white/10 
            rounded-[3rem] 
            min-h-[600px] 
            p-8 md:p-10
            shadow-[0_20px_50px_rgba(0,0,0,0.3)]
          "
          >
            <div className="relative z-20">
              <Outlet />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Archieve
