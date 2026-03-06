import React, { useEffect, useState } from 'react'
import {
  FaUserAlt,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa'
import axios from 'axios'
import { useNotifications } from '../../context/NotificationContext'

function MyProfile() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [data, setData] = useState({})
  const [open, setOpen] = useState(false)
  const [inpType, setInpType] = useState(false)
  const [eye, setEye] = useState(false)
  const { isSoundEnabled, toggleSound, isEmailEnabled, toggleEmail } = useNotifications()

  // SETTINGS STATE
  const [settings, setSettings] = useState({
    notifications: isSoundEnabled,
    emailAlerts: isEmailEnabled,
    twoFactor: false,
    privateMode: false,
    autoLogout: true,
    saveSession: true,
    developerMode: false,
  })

  const [newFullname, setNewFullname] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const getData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/employees/${user?.id || 7}`
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
        updatedUser
      )
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setOpen(false)
      getData()
    } catch (err) {
      console.log(err)
    }
  }

  if (!user) return null

  const settingList = [
    { label: 'Notifications', key: 'notifications' },
    { label: 'Email Alerts', key: 'emailAlerts' },
    { label: 'Two Factor Auth', key: 'twoFactor' },
    { label: 'Private Mode', key: 'privateMode' },
    { label: 'Auto Logout', key: 'autoLogout' },
    { label: 'Save Session', key: 'saveSession' },
    { label: 'Developer Mode', key: 'developerMode' },
  ]

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] p-6 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PROFILE */}
        <section className="rounded-2xl bg-[var(--card-bg)] border border-cyan-500/20 p-8 shadow-xl flex flex-col justify-between min-h-[550px] transition-colors">
          <div>
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 rounded-xl bg-cyan-600/20 flex items-center justify-center text-cyan-400 text-3xl">
                <FaUserAlt />
              </div>
              <div>
                <h2 className="text-[var(--text-primary)] text-2xl font-bold">
                  {data.fullName}
                </h2>
                <p className="text-cyan-500 text-xs font-bold uppercase tracking-widest">
                  {data.role}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between border-b border-cyan-500/10 pb-3">
                <span className="text-cyan-500 text-sm">Email</span>
                <span className="text-[var(--text-primary)] text-sm">{data.email}</span>
              </div>

              <div className="flex justify-between border-b border-cyan-900/30 pb-3">
                <span className="text-cyan-400 text-sm">Password</span>
                <input
                  type={inpType ? 'text' : 'password'}
                  readOnly
                  value={data.password}
                  onClick={() => setInpType(!inpType)}
                  className="text-[var(--text-primary)] text-right bg-transparent outline-none cursor-pointer"
                />
              </div>

              <div className="flex justify-between border-b border-cyan-500/10 pb-3">
                <span className="text-cyan-500 text-sm">Hire Date</span>
                <span className="text-[var(--text-primary)] text-sm">{data.hireDate}</span>
              </div>


              <div className="flex justify-between border-b border-cyan-500/10 pb-3">
                <span className="text-cyan-500 text-sm">Role</span>
                <span className="text-cyan-300 text-sm font-bold uppercase">
                  {data.role}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenModal}
            className="w-full py-3 rounded-xl bg-cyan-600/10 border border-cyan-600/30 text-cyan-400 font-bold hover:bg-cyan-600 hover:text-black transition uppercase text-xs tracking-widest"
          >
            Edit Profile
          </button>
        </section>

        {/* SETTINGS (rasmdagidek) */}
        <section className="rounded-2xl bg-[var(--card-bg)] border border-cyan-500/20 p-8 shadow-xl min-h-[550px] transition-colors">
          <div className="space-y-8">
            {settingList.map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-[var(--text-primary)] text-[15px]">
                  {item.label}
                </span>

                <button
                  onClick={() => {
                    const newVal = !settings[item.key];
                    setSettings((prev) => ({
                      ...prev,
                      [item.key]: newVal,
                    }));
                    if (item.key === 'notifications') toggleSound(newVal);
                    if (item.key === 'emailAlerts') toggleEmail(newVal);
                  }}
                  className={`w-16 h-8 flex items-center rounded-full p-1 transition duration-300 ${settings[item.key]
                    ? 'bg-cyan-500'
                    : 'bg-[#1e293b]'
                    }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow transform transition duration-300 ${settings[item.key]
                      ? 'translate-x-8'
                      : 'translate-x-0'
                      }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[var(--card-bg)] border border-cyan-500/30 p-8 relative transition-colors">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-cyan-400"
            >
              <FaTimes />
            </button>

            <h2 className="text-[var(--text-primary)] text-xl font-bold mb-6">
              Update Profile
            </h2>

            <form onSubmit={submitData} className="space-y-4">
              <input
                type="text"
                value={newFullname}
                onChange={(e) => setNewFullname(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-[var(--bg-primary)] border border-cyan-500/20 rounded-lg px-4 py-3 text-[var(--text-primary)] outline-none focus:border-cyan-500/50 transition-all"
              />

              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-[var(--bg-primary)] border border-cyan-900 rounded-lg px-4 py-3 text-[var(--text-primary)] outline-none"
              />

              <div className="flex items-center justify-between bg-[var(--bg-primary)] border border-cyan-900 rounded-lg px-4 py-3">
                <input
                  type={eye ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Password"
                  className="bg-transparent text-[var(--text-primary)] outline-none"
                />
                <span onClick={() => setEye(!eye)}>
                  {eye ? (
                    <FaEyeSlash className="text-cyan-400 text-xl cursor-pointer" />
                  ) : (
                    <FaEye className="text-cyan-400 text-xl cursor-pointer" />
                  )}
                </span>
              </div>


              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-600 text-black font-bold hover:bg-cyan-500 transition uppercase text-xs tracking-widest"
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
