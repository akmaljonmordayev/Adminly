import React, { useState } from 'react'
import {
  FaBars,
  FaSearch,
  FaBell,
  FaBellSlash,
  FaUserCircle,
} from 'react-icons/fa'
import { MdOutlineMailOutline } from 'react-icons/md'
import { IoLogOutOutline, IoClose } from 'react-icons/io5'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../context/NotificationContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { theme } from 'antd'

function EmployeeTopBar({ onToggle }) {
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()
  const { notifications, markAllAsRead, isSoundEnabled, isEmailEnabled } = useNotifications()
  const [modal, setModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const hour = new Date().getHours()

  const SignOut = () => {
    toast.info('Signing out...'), { theme: 'dark' }
    setTimeout(() => {
      localStorage.clear()
      navigate('/auth/signin')
    }, 1000)
  }

  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'name',
    email: 'name@example.com',
  }

  return (
    <div className="bg-[var(--bg-secondary)] w-full h-16 flex items-center px-6 gap-4 border-b border-cyan-500/20 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <button
        onClick={onToggle}
        className="p-2.5 rounded-xl transition-all hover:bg-cyan-500/20 group active:scale-90"
      >
        <FaBars className="text-cyan-400 text-xl group-hover:rotate-180 transition-transform duration-500" />
      </button>

      <div className="flex-1 ml-2">
        <h2 className="flex tracking-wide items-center gap-3 text-[var(--text-primary)] text-xl md:text-xl font-extrabold tracking-tight">
          <span className="opacity-90">
            {hour < 12
              ? 'Good Morning'
              : hour < 18
                ? 'Good Afternoon'
                : 'Good Evening'}
            ,
          </span>
          <span className="relative text-cyan-500">
            {user?.name}!
          </span>
        </h2>
      </div>

      <div className="flex items-center ml-auto gap-2 md:gap-4">
        <div
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-cyan-500/10 cursor-pointer text-cyan-500 transition-all active:scale-95"
          title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </div>

        <div className={`relative p-2.5 rounded-full hover:bg-cyan-500/10 cursor-pointer text-cyan-500 transition-all ${!isEmailEnabled ? 'opacity-40 grayscale' : ''}`}>
          <MdOutlineMailOutline size={22} />
          {isEmailEnabled && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]"></span>
          )}
        </div>

        <div className="relative border-r border-cyan-500/20 pr-4 mr-2">
          <div
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 w-10 h-10 rounded-full hover:bg-cyan-500/10 cursor-pointer text-cyan-400 transition-all flex items-center justify-center relative"
          >
            {isSoundEnabled ? (
              <FaBell className={`w-5 h-5 ${notifications.length > 0 ? 'animate-bounce' : ''}`} />
            ) : (
              <FaBellSlash className="w-5 h-5 opacity-40" />
            )}
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[var(--bg-secondary)]">
                {notifications.length}
              </span>
            )}
          </div>

          {/* iPhone Style Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-14 right-0 w-80 bg-[var(--bg-secondary)]/95 backdrop-blur-xl border border-cyan-500/30 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
              <div className="p-6 border-b border-cyan-500/10 flex justify-between items-center">
                <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Notifications</h3>
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400 transition-colors uppercase tracking-widest"
                >
                  Read All
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-5 border-b border-cyan-500/5 hover:bg-cyan-500/5 transition-colors group">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">{notif.title}</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">{new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed group-hover:text-[var(--text-primary)] transition-colors italic">
                        "{notif.message}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-500/30">
                      <FaBell size={24} />
                    </div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">All caught up!</p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-cyan-500/5 flex justify-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] font-black text-slate-500 hover:text-[var(--text-primary)] uppercase tracking-widest transition-colors"
                >
                  Close Panel
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          onClick={() => setModal(true)}
          className="relative group cursor-pointer active:scale-95 transition-transform"
        >
          <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full opacity-40 blur group-hover:opacity-50 transition"></div>
          <div className="relative bg-[var(--bg-secondary)] rounded-full p-0.5 border border-cyan-500/30">
            <FaUserCircle className="text-cyan-500 text-3xl group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setModal(false)}
          />

          <div className="relative bg-[var(--bg-secondary)] w-full max-w-[340px] rounded-[2.5rem] border border-cyan-500/30 overflow-hidden shadow-2xl">
            <div className="h-24 bg-gradient-to-br from-cyan-600/20 via-blue-600/10 to-transparent relative">
              <button
                onClick={() => setModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/40 text-cyan-400 hover:text-white transition-all hover:rotate-90"
              >
                <IoClose size={20} />
              </button>
            </div>

            <div className="px-8 pb-10 -mt-12 flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-4 rounded-full"></div>
                <div className="relative bg-[#0f172a] p-1.5 rounded-full border border-cyan-500/40">
                  <FaUserCircle
                    onClick={() =>
                      toast.error(
                        'Bu funksiya faqat Premium foydalanuvchilar uchun mavjud. Premium narxi: 1 000 000 $.',
                        { theme: 'dark' },
                      )
                    }
                    className="text-cyan-400 text-7xl"
                  />
                </div>
              </div>

              <div className="text-center mt-6">
                <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                  {user.fullName}
                </h3>
                <div className="mt-2 inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  <span className="text-[10px] font-black uppercase tracking-[2.5px] text-cyan-400">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="w-full space-y-3 mt-10">
                <button
                  onClick={SignOut}
                  className="w-full flex items-center justify-between py-4 px-6 bg-red-500/5 hover:bg-red-500/15 text-red-500 rounded-2xl border border-red-500/10 transition-all group active:scale-[0.98]"
                >
                  <span className="font-bold text-sm text-red-400">
                    Sign out
                  </span>
                  <IoLogOutOutline
                    size={22}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
            <div className="h-2 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40"></div>
          </div>
        </div>
      )}

      <ToastContainer theme="dark" position="top-right" />
    </div>
  )
}

export default EmployeeTopBar
