import {
  FiMenu, FiSearch, FiBell, FiBellOff, FiUser,
  FiMail, FiLogOut, FiSun, FiMoon, FiChevronDown, FiX, FiSettings
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../context/NotificationContext'
import { toast, ToastContainer } from 'react-toastify'
import { useState, useEffect } from 'react'
import React from 'react'
import 'react-toastify/dist/ReactToastify.css'

function TopBar({ onToggle }) {
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()
  const { notifications, markAllAsRead, isSoundEnabled } = useNotifications()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 18) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
  }, [])

  const rawUser = localStorage.getItem('user')
  let user = { name: 'Administrator', email: 'admin@adminly.com' }
  try {
    if (rawUser && rawUser !== 'undefined') {
      user = JSON.parse(rawUser)
    }
  } catch (e) {
    console.error('Failed to parse user from localStorage', e)
  }

  const handleSignOut = () => {
    toast.info('Securely signing out...')
    setTimeout(() => {
      localStorage.clear()
      navigate('/auth/signin')
    }, 800)
  }

  const userName = user?.name || 'Admin'
  const userFirst = userName.split(' ')[0]

  return (
    <nav className="h-20 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 px-6 flex items-center justify-between transition-all duration-300">

      {/* Left Section: Menu & Greeting */}
      <div className="flex items-center gap-6">
        <button
          onClick={onToggle}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-cyan-500/10 text-[var(--text-secondary)] hover:text-cyan-400 transition-all active:scale-95"
        >
          <FiMenu size={20} />
        </button>

        <div className="hidden md:block">
          <h2 className="text-xl font-black tracking-tighter text-[var(--text-primary)] leading-none italic uppercase">
            {greeting}, <span className="text-cyan-500">{userFirst}!</span>
          </h2>
          <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mt-1.5 opacity-60">System Operational · {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
        </div>
      </div>

      {/* Middle Section: Search (Visual Only) */}
      <div className="hidden lg:flex flex-1 max-w-md mx-8 relative group">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-cyan-400 transition-colors" />
        <input
          type="text"
          placeholder="Global System Search..."
          className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-cyan-500/30 focus:bg-white/[0.08] transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-white/10 text-[9px] font-black text-[var(--text-secondary)] tracking-tighter">⌘ K</div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-cyan-500 transition-all active:scale-90"
        >
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-all active:scale-90 relative ${showNotifications ? 'bg-white/5 text-cyan-400 shadow-inner shadow-black/20' : 'text-[var(--text-secondary)]'}`}
          >
            {isSoundEnabled ? <FiBell size={20} /> : <FiBellOff size={20} />}
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-secondary)] shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute top-12 right-0 w-80 bg-[var(--bg-secondary)] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 animate-fadeInUp">
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <h3 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">Activity Feed</h3>
                  <button onClick={markAllAsRead} className="text-[9px] font-black text-cyan-500 hover:text-cyan-400 uppercase tracking-tighter">Clear All</button>
                </div>
                <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-tight">{n.title}</span>
                          <span className="text-[8px] text-[var(--text-secondary)] font-bold uppercase">{new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-snug group-hover:text-[var(--text-primary)] transition-colors line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center opacity-40">
                      <FiBell className="mx-auto mb-2 opacity-20" size={32} />
                      <p className="text-[10px] font-black uppercase tracking-widest">No new updates</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Trigger */}
        <div className="relative pl-4 border-l border-white/10 ml-2">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center gap-3 p-1 pr-3 rounded-2xl transition-all group ${showUserMenu ? 'bg-white/10 shadow-inner' : 'hover:bg-white/5'}`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/10 group-hover:shadow-cyan-500/20 transition-all">
              <div className="w-full h-full rounded-[10px] bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden">
                <FiUser className="text-cyan-500 text-lg group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">{user.name.split(' ')[0]}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-[9px] font-black text-emerald-500/70 uppercase tracking-widest">Active</span>
              </div>
            </div>
            <FiChevronDown className={`text-[var(--text-secondary)] transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute top-14 right-0 w-64 bg-[var(--bg-secondary)] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 animate-fadeInUp">
                <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-transparent flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-primary)] border border-white/5 flex items-center justify-center mb-4 shadow-xl">
                    <FiUser size={32} className="text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">{user.name}</h4>
                  <p className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] mt-1">{user.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => { setShowUserMenu(false); navigate('/manager/settings'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-[11px] font-black text-[var(--text-secondary)] hover:text-cyan-400 transition-all uppercase tracking-widest"
                  >
                    <FiSettings /> Account Settings
                  </button>
                  <button
                    onClick={() => { setShowUserMenu(false); handleSignOut(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/5 text-[11px] font-black text-red-500/60 hover:text-red-500 transition-all uppercase tracking-widest"
                  >
                    <FiLogOut /> Sign Out System
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ToastContainer theme={isDarkMode ? 'dark' : 'light'} position="top-right" autoClose={2000} />
    </nav>
  )
}

export default TopBar
