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
  const [open, setOpen] = useState(false)

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/users')
        setData(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getUsers()
  }, [])

  const onSubmitted = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axios.get('http://localhost:5000/users')
      const users = res.data

      const existUser = users.find((u) => u.email === email)

      if (existUser) {
        toast.error('Sizda allaqachon account bor')
        setTimeout(() => {
          navigate('/auth/signin')
        }, 1500)
        return
      }

      const lastId =
        users.length > 0 ? Number(users[users.length - 1].id) + 1 : 1

      const newUser = {
        id: String(lastId),
        name,
        email,
        password,
        role: 'manager',
      }

      await axios.post('http://localhost:5000/users', newUser)

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
      <div className="min-h-screen flex items-center justify-center bg-[#050b14]">
        <div
          className="relative w-[900px] h-[500px] rounded-xl overflow-hidden 
          bg-linear-to-br from-[#0b1220] to-[#050b14]
          shadow-[0_0_40px_rgba(0,255,255,0.25)]
          border border-cyan-400/30 flex"
        >
          {/* LEFT */}
          <div
            className="rotate-20 w-150 h-200 relative -top-50 -left-35 flex items-center justify-center
            bg-linear-to-br from-cyan-500/20 to-blue-600/20 clip-path-diagonal"
          >
            <h1 className="text-left -rotate-20 relative top-1 left-10 text-4xl font-bold text-white">
              CREATE <br /> ACCOUNT
            </h1>
          </div>

          {/* RIGHT */}
          <div className="w-1/2 p-10 flex flex-col justify-center">
            <h2 className="text-center text-4xl font-semibold text-white mb-8">
              Sign Up
            </h2>

            <form onSubmit={onSubmitted} className="space-y-6">
              {/* EMAIL */}
              <span className="relative block">
                <input
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full bg-transparent border-b border-cyan-400/40
                  text-white py-3 pr-10 outline-none focus:border-cyan-400"
                />
                <label
                  className="absolute left-0 top-3 text-gray-400 text-sm
                  transition-all peer-focus:-top-4 peer-focus:text-xs
                  peer-focus:text-cyan-400 peer-valid:-top-4 peer-valid:text-xs"
                >
                  Email
                </label>
                <MdEmail className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400" />
              </span>

              {/* PASSWORD */}
              <span className="relative block">
                <input
                  type={open ? 'text' : 'password'}
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full bg-transparent border-b border-cyan-400/40
                  text-white py-3 pr-10 outline-none focus:border-cyan-400"
                />
                <label
                  className="absolute left-0 top-3 text-gray-400 text-sm
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

              {/* NAME */}
              <span className="relative block">
                <input
                  type="text"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="peer w-full bg-transparent border-b border-cyan-400/40
                  text-white py-3 pr-10 outline-none focus:border-cyan-400"
                />
                <label
                  className="absolute left-0 top-3 text-gray-400 text-sm
                  transition-all peer-focus:-top-4 peer-focus:text-xs
                  peer-focus:text-cyan-400 peer-valid:-top-4 peer-valid:text-xs"
                >
                  Full Name
                </label>
                <FaUser className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400" />
              </span>

              <button
                disabled={loading}
                className="w-full py-2 rounded-full bg-linear-to-b
                from-cyan-500 to-black text-white font-semibold hover:opacity-90"
              >
                {loading ? 'Loading...' : 'Create account'}
              </button>
            </form>

            <div className="flex justify-center gap-2 mt-6 text-sm text-gray-400">
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
