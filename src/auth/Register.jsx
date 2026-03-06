import { useState, useEffect } from 'react'
import React from 'react'
import { FaUser, FaLock, FaLockOpen } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Register() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [selectedRole, setSelectedRole] = useState('employee')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

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

      const existUser = allUsers.find((u) => u.email === email)

      if (existUser) {
        toast.error('Sizda allaqachon account bor')
        setTimeout(() => {
          navigate('/auth/signin')
        }, 1500)
        return
      }

      if (selectedRole === 'manager') {
        const lastId = usersRes.data.length > 0 ? Number(usersRes.data[usersRes.data.length - 1].id) + 1 : 1
        const newUser = {
          id: String(lastId),
          name,
          email,
          password,
          role: 'manager',
        }
        await axios.post('http://localhost:5000/users', newUser)
      } else {
        const lastId = employeesRes.data.length > 0 ? Number(employeesRes.data[employeesRes.data.length - 1].id) + 1 : 1
        const newEmployee = {
          id: String(lastId),
          fullName: name,
          email,
          password,
          role: 'employee',
          hireDate: new Date().toISOString().split('T')[0],
          status: 'active'
        }
        await axios.post('http://localhost:5000/employees', newEmployee)
      }

      toast.success('Account muvaffaqiyatli yaratildi')

      setName('')
      setEmail('')
      setPassword('')

      setTimeout(() => {
        navigate('/auth/signin')
      }, 1500)
    } catch (err) {
      toast.error('Xatolik yuz berdi')
      console.log(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div
          className="relative w-[900px] min-h-[580px] py-10 rounded-xl overflow-hidden 
          bg-[var(--bg-secondary)]
          shadow-2xl
          border border-cyan-500/20 flex items-center"
        >
          <div
            className="rotate-20 w-150 h-200 relative -top-50 -left-35 flex items-center justify-center
            bg-linear-to-br from-cyan-500/20 to-blue-600/20 clip-path-diagonal"
          >
            <h1 className="text-left -rotate-20 relative top-1 left-10 text-4xl font-bold text-[var(--text-primary)]">
              CREATE <br /> ACCOUNT
            </h1>
          </div>

          <div className="w-1/2 p-10 flex flex-col justify-center">
            <h2 className="text-center text-4xl font-semibold text-[var(--text-primary)] mb-8">
              Sign Up
            </h2>

            <form onSubmit={onSubmitted} className="space-y-6">
              <span className="relative block">
                <input
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full bg-transparent border-b border-cyan-500/40
                  text-[var(--text-primary)] py-3 pr-10 outline-none focus:border-cyan-400"
                />
                <label
                  className="absolute left-0 top-3 text-[var(--text-secondary)] text-sm
                  transition-all peer-focus:-top-4 peer-focus:text-xs
                  peer-focus:text-cyan-400 peer-valid:-top-4 peer-valid:text-xs"
                >
                  Email
                </label>
                <MdEmail className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400" />
              </span>

              <span className="relative block">
                <input
                  type={open ? 'text' : 'password'}
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full bg-transparent border-b border-cyan-500/40
                  text-[var(--text-primary)] py-3 pr-10 outline-none focus:border-cyan-400"
                />
                <label
                  className="absolute left-0 top-3 text-[var(--text-secondary)] text-sm
                  transition-all peer-focus:-top-4 peer-focus:text-xs
                  peer-focus:text-cyan-400 peer-valid:-top-4 peer-valid:text-xs"
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

              <span className="relative block">
                <input
                  type="text"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="peer w-full bg-transparent border-b border-cyan-500/40
                  text-[var(--text-primary)] py-3 pr-10 outline-none focus:border-cyan-400"
                />
                <label
                  className="absolute left-0 top-3 text-[var(--text-secondary)] text-sm
                  transition-all peer-focus:-top-4 peer-focus:text-xs
                  peer-focus:text-cyan-400 peer-valid:-top-4 peer-valid:text-xs"
                >
                  Full Name
                </label>
                <FaUser className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400" />
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
                disabled={loading}
                className="w-full py-2 rounded-full bg-linear-to-b
                from-cyan-500 to-black text-[var(--text-primary)] font-semibold hover:opacity-90"
              >
                {loading ? 'Loading...' : 'Create account'}
              </button>
            </form>

            <div className="flex justify-center gap-2 mt-6 text-sm text-[var(--text-secondary)]">
              <p>Already have an account?</p>
              <Link to="/auth/signin" className="text-cyan-400 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </>
  )
}

export default Register
