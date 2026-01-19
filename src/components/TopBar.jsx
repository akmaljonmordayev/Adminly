import React from 'react'
import { FaBars, FaSearch, FaBell, FaUserCircle } from 'react-icons/fa'
import { IoLogOutOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { MdOutlineMailOutline } from 'react-icons/md'

function TopBar({ image, name, username, onToggle }) {
  const navigate = useNavigate()

  const SignOut = () => {
    toast.info('Signing out...')
    setTimeout(() => {
      localStorage.clear()
      navigate('/auth/signin')
    }, 1500)
  }

  const toggleBars = () => {
    onToggle()
    localStorage.setItem('token', 'sizning_maxfiy_tokeningiz')
  }

  return (
    <div className="bg-[#0b1220] w-full h-16 flex items-center px-6 gap-4 border-b border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <button
        onClick={() => toggleBars()}
        className="p-2 rounded-lg transition-all duration-300 hover:bg-cyan-500/20 active:scale-90 group"
      >
        <FaBars className="text-cyan-400 text-xl group-hover:rotate-180 transition-transform duration-500" />
      </button>

      <div className="flex items-center bg-[#020617] border border-cyan-400/30 rounded-xl px-4 py-1.5 w-72 transition-all duration-300 focus-within:w-80 focus-within:border-cyan-400 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.2)]">
        <input
          placeholder="Search..."
          type="text"
          className="bg-transparent outline-none text-cyan-100 w-full placeholder:text-cyan-800 text-sm"
        />
        <FaSearch className="text-cyan-600 group-hover:text-cyan-400 transition-colors" />
      </div>

      <div className="flex items-center ml-auto gap-6">
        <div className="flex items-center gap-3 group cursor-pointer p-1 rounded-xl transition-all">
          <div className="text-right transition-transform duration-300 group-hover:-translate-x-1">
            <h2 className="font-bold text-cyan-100 text-sm group-hover:text-cyan-400 transition-colors">
              {name}
            </h2>
            <span className="text-[10px] text-cyan-600 font-mono block -mt-1 uppercase tracking-tighter group-hover:text-cyan-300">
              {username}
            </span>
          </div>
          <div className="relative overflow-hidden rounded-full border-2 border-cyan-500/20 group-hover:border-cyan-400 transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.4)]">
            <FaUserCircle className="text-cyan-300 text-[32px] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-cyan-500/20 pl-6">
          <div className="relative group cursor-pointer p-2 rounded-full hover:bg-cyan-500/10 transition-all duration-300">
            <MdOutlineMailOutline className="text-cyan-400 text-2xl group-hover:scale-110 transition-transform" />
          </div>

          <div className="relative group cursor-pointer p-2 rounded-full hover:bg-cyan-500/10 transition-all duration-300">
            <FaBell className="text-cyan-400 text-xl group-hover:rotate-[15deg] transition-transform" />
          </div>

          <div
            onClick={SignOut}
            className="group cursor-pointer p-2 rounded-full hover:bg-red-500/20 transition-all duration-300"
          >
            <IoLogOutOutline className="text-cyan-400 text-[26px] group-hover:text-red-500 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all" />
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </div>
  )
}

export default TopBar
