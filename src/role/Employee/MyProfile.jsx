import React, { useEffect, useState } from 'react'
import {
  FaUserAlt,
  FaTimes,
  FaWallet,
  FaChartLine,
  FaGift,
  FaUserSlash,
  FaCalendarCheck,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa'
import axios from 'axios'

function MyProfile() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [data, setData] = useState({})
  const [open, setOpen] = useState(false)
  const [inpType, setInpType] = useState(false)
  const [eye, setEye] = useState(false)

  const [newFullname, setNewFullname] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const getData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/employees/${user?.id || 7}`,
      )
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (user) getData()
  }, [])

  const handleOpenModal = () => {
    setNewFullname(data.fullName || '')
    setNewEmail(data.email || '')
    setNewPassword(data.password || '')
    setOpen(true)
  }

  const submitData = async (e) => {
    e.preventDefault()
    try {
      const updatedUser = {
        ...data,
        fullName: newFullname,
        email: newEmail,
        password: newPassword,
      }
      await axios.put(
        `http://localhost:5000/employees/${user?.id || 7}`,
        updatedUser,
      )
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setOpen(false)
      getData()
    } catch (err) {
      console.log(err)
    }
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-[#020617] p-6 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PROFILE SECTION */}
        <section className="rounded-2xl bg-[#0b1220] border border-cyan-900/50 p-8 shadow-xl flex flex-col justify-between min-h-[550px]">
          <div>
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 rounded-xl bg-cyan-600/20 flex items-center justify-center text-cyan-400 text-3xl">
                <FaUserAlt />
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold">
                  {data.fullName}
                </h2>
                <p className="text-cyan-500 text-xs font-bold uppercase tracking-widest">
                  {data.role}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between border-b border-cyan-900/30 pb-3">
                <span className="text-cyan-400 text-sm font-medium">Email</span>
                <span className="text-white text-sm">{data.email}</span>
              </div>
              <div className="flex justify-between border-b border-cyan-900/30 pb-3">
                <span className="text-cyan-400 text-sm font-medium">
                  Password
                </span>
                <input
                  tabIndex={-1}
                  type={inpType ? 'text' : 'password'}
                  readOnly
                  className="text-white text-right focus:outline-0 cursor-pointer"
                  value={data.password}
                  onClick={() => setInpType(!inpType)}
                />
              </div>
              <div className="flex justify-between border-b border-cyan-900/30 pb-3">
                <span className="text-cyan-400 text-sm font-medium">
                  Hire Date
                </span>
                <span className="text-white text-sm">{data.hireDate}</span>
              </div>
              <div className="flex justify-between border-b border-cyan-900/30 pb-3">
                <span className="text-cyan-400 text-sm font-medium">Role</span>
                <span className="text-cyan-300 text-sm font-bold uppercase">
                  {data.role}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenModal}
            className="w-full py-3 rounded-xl bg-cyan-600/10 border border-cyan-600/30 text-cyan-400 font-bold hover:bg-cyan-600 hover:text-black transition-all uppercase text-xs tracking-widest"
          >
            Edit Profile
          </button>
        </section>

        {/* FINANCE SECTION */}
        <section className="rounded-2xl bg-[#0b1220] border border-cyan-900/50 p-8 shadow-xl">
          <h3 className="text-white text-lg font-bold mb-8 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-cyan-500 rounded-full"></span>
            Finance Overview
          </h3>

          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3 text-cyan-400/80">
                <FaWallet /> <span>Base Salary</span>
              </div>
              <span className="text-white font-bold">
                {data.baseSalary?.toLocaleString()} UZS
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3 text-cyan-400/80">
                <FaChartLine /> <span>KPI Amount</span>
              </div>
              <span className="text-emerald-400 font-bold">
                +{data.kpiAmount?.toLocaleString()} UZS
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3 text-cyan-400/80">
                <FaGift /> <span>Bonus</span>
              </div>
              <span className="text-emerald-400 font-bold">
                +{data.bonus?.toLocaleString()} UZS
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3 text-cyan-400/80">
                <FaUserSlash /> <span>Penalty</span>
              </div>
              <span className="text-rose-500 font-bold">
                -{data.penalty?.toLocaleString()} UZS
              </span>
            </div>

            <div className="h-[1px] bg-cyan-900/30"></div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3 text-cyan-400/80">
                <FaCalendarCheck /> <span>Salary Month</span>
              </div>
              <span className="text-white">{data.month}</span>
            </div>

            <div className="mt-10 p-5 bg-cyan-600/5 border border-cyan-600/20 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest">
                  Net Salary
                </p>
                <span className="text-white font-bold">Total Payable</span>
              </div>
              <span className="text-2xl font-black text-cyan-400">
                {data.totalSalary?.toLocaleString()}{' '}
                <span className="text-xs font-medium">UZS</span>
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* EDIT MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0b1220] border border-cyan-500/30 p-8 shadow-2xl relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-cyan-400 hover:text-white transition"
            >
              <FaTimes />
            </button>
            <h2 className="text-white text-xl font-bold mb-6">
              Update Profile
            </h2>

            <form onSubmit={submitData} className="space-y-4">
              <input
                type="text"
                value={newFullname}
                onChange={(e) => setNewFullname(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-[#020617] border border-cyan-900 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-[#020617] border border-cyan-900 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="flex gap-x-36 items-center w-full bg-[#020617] border border-cyan-900 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500">
                <input
                  type={eye ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className=""
                />
                <span onClick={() => setEye(!eye)}>
                  {eye ? (
                    <FaEyeSlash className="text-[#2BD3F3] text-2xl" />
                  ) : (
                    <FaEye className="text-[#2BD3F3] text-2xl" />
                  )}
                </span>
              </span>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-600 text-black font-black hover:bg-cyan-500 transition-all uppercase text-xs tracking-widest"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default MyProfile
