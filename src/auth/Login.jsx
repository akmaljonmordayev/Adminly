import { useState, useEffect } from 'react'
import React from 'react'
import { FaUser } from 'react-icons/fa'
import { FaLock } from 'react-icons/fa'
import { FaLockOpen } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('employee')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmitted = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const [usersRes, employeesRes] = await Promise.all([
        axios.get('http://localhost:5000/users'),
        axios.get('http://localhost:5000/employees')
      ])

      const allUsers = [...usersRes.data, ...employeesRes.data]

      // Filter by email and password
      const foundUser = allUsers.find(
        (item) => item.email === email && item.password === password
      )

      if (!foundUser) {
        toast.error('Email yoki parol noto\'g\'ri!')
        setLoading(false)
        return
      }

      if (foundUser.role !== selectedRole) {
        toast.error(`Ushbu akkaunt ${selectedRole} emas! Iltimos taxingizni tekshiring.`)
        setLoading(false)
        return
      }

      toast.success('Tizimga muvaffaqiyatli kirdingiz!')
      const token = crypto.randomUUID()

      const userData = {
        ...foundUser,
        name: foundUser.name || foundUser.fullName,
        fullName: foundUser.fullName || foundUser.name
      }

      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', token)

      setTimeout(() => {
        if (userData.role === "manager") {
          navigate('/manager/dashboard')
        } else {
          navigate('/employee/myhome')
        }
      }, 1500)
    } catch (err) {
      toast.error('Xatolik yuz berdi: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div
        className="relative w-[900px] min-h-[500px] py-10 rounded-xl overflow-hidden 
    bg-[var(--bg-secondary)]
    shadow-2xl
    border border-cyan-500/20
    flex items-center"
      >
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-center text-4xl font-semibold text-[var(--text-primary)] mb-8">
            Login
          </h2>

          <form onSubmit={(e) => onSubmitted(e)} className="space-y-6">
            <span className="relative block mt-6">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                value={email}
                className="
  peer w-full bg-transparent border-b border-cyan-500/40
  text-[var(--text-primary)] py-3 pr-10 outline-none
  focus:border-cyan-400
  transition-all duration-300
"
              />

              <label
                className="
  absolute left-0 top-3 text-[var(--text-secondary)] text-sm
  pointer-events-none
  transition-all duration-300
  peer-focus:-top-4
  peer-focus:text-cyan-400
  peer-focus:text-xs
  peer-valid:-top-4
  peer-valid:text-xs
"
              >
                Email
              </label>

              <FaUser className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400" />
            </span>
            <span className="relative block mt-8">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={open ? 'text' : 'password'}
                required
                value={password}
                className="
  peer w-full bg-transparent border-b border-cyan-500/40
  text-[var(--text-primary)] py-3 pr-10 outline-none
  focus:border-cyan-400
  transition-all duration-300
"
              />

              <label
                className="
  absolute left-0 top-3 text-[var(--text-secondary)] text-sm
  pointer-events-none
  transition-all duration-300
  peer-focus:-top-4
  peer-focus:text-cyan-400
  peer-focus:text-xs
  peer-valid:-top-4
  peer-valid:text-xs
"
              >
                Password
              </label>

              {open ? (
                <FaLockOpen
                  onClick={() => setOpen(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400 cursor-pointer"
                />
              ) : (
                <FaLock
                  onClick={() => setOpen(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400 cursor-pointer"
                />
              )}
            </span>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setSelectedRole('employee')}
                className={`flex-1 py-3 rounded-xl border font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 ${selectedRole === 'employee'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] scale-105'
                  : 'bg-transparent border-cyan-400/20 text-slate-500 hover:border-cyan-400/50 hover:text-cyan-200'
                  }`}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('manager')}
                className={`flex-1 py-3 rounded-xl border font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 ${selectedRole === 'manager'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] scale-105'
                  : 'bg-transparent border-cyan-400/20 text-slate-500 hover:border-cyan-400/50 hover:text-cyan-200'
                  }`}
              >
                Manager
              </button>
            </div>

            <button
              className="w-full mt-6 py-2 rounded-full
          bg-linear-to-b from-cyan-500 to-black
         font-semibold text-[var(--text-primary)]
          hover:opacity-90 transition cursor-pointer"
            >
              {loading ? 'loading...' : 'Login'}
            </button>
          </form>
          <span className="justify-center flex gap-2 mt-6 text-sm text-[var(--text-secondary)]">
            <p>Don't have an account</p>
            <Link to={'/auth/signup'} className="text-cyan-400 hover:underline">
              Sign Up
            </Link>
          </span>
        </div>

        <div
          className="-rotate-20 w-150 h-200 relative -top-50 left-30 flex items-center justify-center
      bg-linear-to-br from-cyan-500/20 to-blue-600/20
      clip-path-diagonal"
        >
          <h1 className="text-right rotate-20 relative -top-5 -left-10 text-4xl font-bold text-[var(--text-primary)] tracking-wide">
            WELCOME <br /> BACK!
          </h1>
        </div>
      </div>
      <ToastContainer theme='dark' position='top-right' />
    </div>
  )
}

export default Login
