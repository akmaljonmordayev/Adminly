import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineExclamationCircle,
  HiOutlineSpeakerphone,
} from 'react-icons/hi'

function Archieve() {
  const { pathname } = useLocation()

  // Aktivlikni tekshirish
  const isActive = (path) => pathname === path

  const navItems = [
    {
      name: 'Employees',
      path: '/manager/archieve/employeesArchieve',
      icon: <HiOutlineUsers />,
    },
    {
      name: 'Tasks',
      path: '/manager/archieve/tasksArchieve',
      icon: <HiOutlineClipboardList />,
    },
    {
      name: 'Complaints',
      path: '/manager/archieve/complaintsArchieve',
      icon: <HiOutlineExclamationCircle />,
    },
    {
      name: 'Announcements',
      path: '/manager/archieve/announcementsArchieve',
      icon: <HiOutlineSpeakerphone />,
    },
  ]

  return (
    // Orqa fonni ham siz xohlagan to'q rangga o'rnatdim
    <div className="min-h-screen bg-[#05080f] p-4 text-white antialiased">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Navigatsiya - SIZNING RANGINGIZ (#0b1220) */}
        <nav className="bg-[#0b1220] border border-white/10 p-1.5 rounded-[22px] shadow-2xl">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.path} className="flex-1">
                <Link
                  to={item.path}
                  // transition-none va duration-0: KECHIKISHSIZ ALMASHISH
                  className={`
                    relative flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] transition-none
                    ${
                      isActive(item.path)
                        ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] ring-1 ring-cyan-500/30'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <span className="text-xl transition-none">{item.icon}</span>
                  <span className="text-sm font-bold tracking-tight hidden md:block">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Kontent - SIZNING RANGINGIZ (#0b1220) */}
        <main className="relative">
          {/* iPhone Titanium Reflection - faqat burchakda yengil nur */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 blur-[80px] pointer-events-none"></div>

          <section
            className="
            relative z-10 
            bg-[#0b1220] 
            border border-white/5 
            rounded-[32px] 
            min-h-[550px] 
            p-8 
            shadow-2xl
          "
          >
            {/* Shisha effekti uchun yengil chiziq */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

            <div className="relative z-20 transition-none">
              <Outlet />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Archieve
