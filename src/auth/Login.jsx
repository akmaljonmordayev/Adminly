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
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      try {
        let res = await axios.get('http://localhost:5000/users')
        setData(res.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

  const onSubmitted = (e) => {
    e.preventDefault()
    const getData = async () => {
      setLoading(true)
      try {
        let res = await axios.get('http://localhost:5000/users')
        setData(res.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    getData()

    let filterData = data?.filter(
      (item) => item.email == email && item.password == password,
    )

    console.log(filterData)

    if (filterData.length == 0) {
      toast.error('No such user found!')
      setTimeout(() => {
        navigate('/auth/signup')
      }, 1500)
    } else {
      toast.success('Successful login!')
      const token = crypto.randomUUID()
      localStorage.setItem('user', JSON.stringify(filterData[0]))
      localStorage.setItem('token', token)
      setTimeout(() => {
        navigate('/manager/dashboard')
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b14]">
      <div
        className="relative w-[900px] h-[420px] rounded-xl overflow-hidden 
    bg-linear-to-br from-[#0b1220] to-[#050b14]
    shadow-[0_0_40px_rgba(0,255,255,0.25)]
    border border-cyan-400/30
    flex"
      >
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-center text-4xl font-semibold text-white mb-8">
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
  peer w-full bg-transparent border-b border-cyan-400/40
  text-white py-3 pr-10 outline-none
  focus:border-cyan-400
  transition-all duration-300
"
              />

              <label
                className="
  absolute left-0 top-3 text-gray-400 text-sm
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
  peer w-full bg-transparent border-b border-cyan-400/40
  text-white py-3 pr-10 outline-none
  focus:border-cyan-400
  transition-all duration-300
"
              />

              <label
                className="
  absolute left-0 top-3 text-gray-400 text-sm
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
            <button
              className="w-full mt-6 py-2 rounded-full
          bg-linear-to-b from-cyan-500 to-black
         font-semibold text-white
          hover:opacity-90 transition cursor-pointer"
            >
              {loading ? 'loading...' : 'Login'}
            </button>
          </form>
          <span className="justify-center flex gap-2 mt-6 text-sm text-gray-400">
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
          <h1 className="text-right rotate-20 relative -top-5 -left-10 text-4xl font-bold text-white tracking-wide">
            WELCOME <br /> BACK!
          </h1>
        </div>
      </div>
      <ToastContainer theme='dark'position='top-right' />
    </div>
  )
}

export default Login
