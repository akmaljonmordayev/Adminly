import React, { useEffect, useState } from 'react'
import { FaUserAlt } from 'react-icons/fa'
import { Modal } from 'antd'
import axios from 'axios'

function Settings() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [data, setData] = useState({})
  const [open, setOpen] = useState(false)

  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [privateMode, setPrivateMode] = useState(false)
  const [autoLogout, setAutoLogout] = useState(true)
  const [saveSession, setSaveSession] = useState(true)
  const [devMode, setDevMode] = useState(false)

  const [newFullname, setNewFullname] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const getData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/users/${user.id}`)
      setData(res.data)
    } catch {}
  }

  useEffect(() => {
    getData()
  }, [])

  const openModal = async () => {
    setOpen(true)
    setNewFullname(data.name)
    setNewEmail(data.email)
    setNewPassword(data.password)
  }

  const submitData = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`http://localhost:5000/users/${user.id}`, {
        ...data,
        name: newFullname,
        email: newEmail,
        password: newPassword,
      })

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...user,
          name: newFullname,
          email: newEmail,
          password: newPassword,
        }),
      )

      await axios.post('http://localhost:5000/logs', {
        userName: user.name,
        action: 'UPDATE',
        date: new Date().toISOString(),
        page: 'SETTINGS',
      })

      setOpen(false)
      getData()
    } catch {}
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-[#020617] p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section
          className="rounded-2xl h-[520px] bg-gradient-to-b from-[#0b1220] to-[#020617]
          border border-cyan-900 p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
        >
          <div className="flex items-center gap-5 mb-8">
            <div
              className="w-16 h-16 rounded-xl bg-cyan-600/20
              flex items-center justify-center text-cyan-400 text-3xl"
            >
              <FaUserAlt />
            </div>

            <div>
              <h2 className="text-white text-2xl font-semibold">{data.name}</h2>
              <p className="text-cyan-400 uppercase text-sm tracking-wider">
                {data.role}
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-10">
            <InfoRow label="Email" value={data.email} />
            <InfoRow label="Password" value={data.password} />
            <InfoRow label="Role" value={data.role} highlight />
          </div>

          <button
            onClick={openModal}
            className="mt-55 w-full py-3 rounded-xl
            bg-cyan-600/20 border border-cyan-600
            text-cyan-400 font-semibold
            hover:bg-cyan-600 hover:text-black transition"
          >
            Edit Profile
          </button>
        </section>

        <section
          className="rounded-2xl bg-gradient-to-b from-[#0b1220] to-[#020617]
  border border-cyan-900 p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)]
  flex flex-col gap-10"
        >
          <Setting
            title="Notifications"
            checked={notifications}
            onClick={() => setNotifications(!notifications)}
          />
          <Setting
            title="Email Alerts"
            checked={emailAlerts}
            onClick={() => setEmailAlerts(!emailAlerts)}
          />
          <Setting
            title="Two Factor Auth"
            checked={twoFA}
            onClick={() => setTwoFA(!twoFA)}
          />
          <Setting
            title="Private Mode"
            checked={privateMode}
            onClick={() => setPrivateMode(!privateMode)}
          />
          <Setting
            title="Auto Logout"
            checked={autoLogout}
            onClick={() => setAutoLogout(!autoLogout)}
          />
          <Setting
            title="Save Session"
            checked={saveSession}
            onClick={() => setSaveSession(!saveSession)}
          />
          <Setting
            title="Developer Mode"
            checked={devMode}
            onClick={() => setDevMode(!devMode)}
          />
        </section>
      </div>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        maskStyle={{
          backgroundColor: 'rgba(8, 145, 178, 0.1)',
        }}
        title={
          <span className="text-cyan-400 font-semibold">Edit Profile</span>
        }
      >
        <form onSubmit={submitData} className="space-y-4">
          <Input
            value={newFullname}
            onChange={setNewFullname}
            placeholder="Full name"
          />
          <Input
            value={newEmail}
            onChange={setNewEmail}
            placeholder="Email"
            type="email"
          />

          <div className="relative">
            <Input
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 text-sm"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-cyan-600 text-black font-semibold
    hover:bg-cyan-500 transition"
          >
            Save Changes
          </button>
        </form>
      </Modal>
    </main>
  )
}

const InfoRow = ({ label, value, highlight }) => (
  <div className="flex justify-between text-sm">
    <span className="text-cyan-400">{label}</span>
    <span className={highlight ? 'text-cyan-300' : 'text-white'}>{value}</span>
  </div>
)

const Setting = ({ title, checked, onClick }) => (
  <div className="flex justify-between items-center">
    <span className="text-white">{title}</span>
    <Switch checked={checked} onClick={onClick} />
  </div>
)

const Switch = ({ checked, onClick }) => (
  <div
    onClick={onClick}
    className={`w-14 h-7 rounded-full px-1 flex items-center cursor-pointer
${checked ? 'bg-cyan-600' : 'bg-[#1e293b]'}`}
  >
    <div
      className={`w-5 h-5 rounded-full bg-white transition
${checked ? 'translate-x-7' : ''}`}
    />
  </div>
)

const Input = ({ value, onChange, ...props }) => (
  <input
    {...props}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-[#020617] border border-cyan-800 rounded-lg
px-4 py-2 text-white placeholder:text-gray-400
focus:outline-none focus:ring-2 focus:ring-cyan-500"
  />
)

export default Settings
