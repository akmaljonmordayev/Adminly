import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import axios from 'axios'
import { useEffect } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function Settings() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [privateMode, setPrivateMode] = useState(false)
  const [autoLogout, setAutoLogout] = useState(true)
  const [saveSession, setSaveSession] = useState(true)
  const [devMode, setDevMode] = useState(false)
  const [open, setOpen] = React.useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newFullname, setNewFullname] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [data, setData] = useState([])

  const getData = async () => {
    let user = JSON.parse(localStorage.getItem('user'))
    try {
      let res = await axios.get(`http://localhost:5000/users/${user.id}`)
      setData(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    getData()
  }, [])

  if (!user) return null
  const showLoading = async () => {
    setOpen(true)
    let user = JSON.parse(localStorage.getItem('user'))
    try {
      let res = await axios.get(`http://localhost:5000/users/${user.id}`)
      setNewFullname(res.data.name)
      setNewEmail(res.data.email)
      setNewPassword(res.data.password)
    } catch (error) {}
  }

  const submitData = async (e) => {
    e.preventDefault()
    let user = JSON.parse(localStorage.getItem('user'))
    try {
      let res = await axios.put(`http://localhost:5000/users/${user.id}`, {
        id: user.id,
        name: newFullname,
        email: newEmail,
        password: newPassword,
        role: 'manager',
      })
      console.log(res)
      if (res.status == 200) {
        alert('done')
        setOpen(false)
        getData()
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: user.id,
            name: newFullname,
            email: newEmail,
            password: newPassword,
            role: 'manager',
          }),
        )
      }
      await axios.post('http://localhost:5000/logs', {
        userName: user.name,
        action: 'UPDATE',
        date: new Date().toISOString(),
        page: 'SETTINGS',
      })
    } catch (error) {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071B2D] to-[#0C2B3E] flex justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1200px]">
        <div className="bg-[#0D3146] flex-1 rounded-2xl p-8 flex flex-col shadow-lg">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D1FF] to-[#00A7CC] flex items-center justify-center text-[#071B2D] text-3xl">
              👤
            </div>
            <div>
              <div className="text-[#EAFBFF] font-semibold text-2xl sm:text-3xl">
                {data?.name}
              </div>
              <div className="text-[#7FCFE3] text-lg sm:text-xl">
                {data.role}
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 mt-4">
            <Row label="Email" value={data.email} />
            <Row label="Password" value={data.password} />
            <Row label="Role" value={data.role} highlight />
          </div>

          <button
            onClick={showLoading}
            className="w-full py-3 mt-auto rounded-xl
            bg-gradient-to-r from-[#00D1FF] to-[#00A7CC] text-[#071B2D] text-lg sm:text-xl font-semibold
            hover:brightness-110 transition"
          >
            Change profile
          </button>
        </div>

        <div className="bg-[#0D3146] flex-1 rounded-2xl p-6 sm:p-8 flex flex-col justify-center gap-4 sm:gap-6 shadow-lg">
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
            title="Two-Factor Auth"
            checked={twoFA}
            onClick={() => setTwoFA(!twoFA)}
          />
          <Setting
            title="Private Profile"
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
        </div>
      </div>
      <style>
        {`
  .custom-dark-modal .ant-modal-content {
    background-color: #071B2D !important;
    border-radius: 20px;
    padding: 0 !important;
  }

  .custom-dark-modal .ant-modal-header {
    border-bottom: none !important;
    padding: 16px 24px;
  }

  .custom-dark-modal .ant-modal-body {
    
    padding: 24px ;
  }


  .custom-dark-modal .ant-modal-close-x {
    color: #22d3ee !important;
    font-size: 18px;
  }
    .custom-dark-modal {
        padding: 0px;
    }
  .ant-modal-container {
    background-color: #071B2D !important;

  }

`}
      </style>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        className="custom-dark-modal"
        title={
          <p className="text-lg font-semibold text-cyan-400">Edit Profile</p>
        }
      >
        <form onSubmit={(e) => submitData(e)} className="flex flex-col gap-4 ">
          <input
            type="text"
            placeholder="Full Name"
            value={newFullname}
            onChange={(e) => setNewFullname(e.target.value)}
            className="
            w-full
            bg-[#07182E]
        border border-cyan-500/40
        text-white
        rounded-lg
        px-4 py-2
        placeholder:text-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-400
        "
          />

          <input
            type="email"
            placeholder="Your Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="
        w-full
        bg-[#07182E]
        border border-cyan-500/40
        text-white
        rounded-lg
        px-4 py-2
        placeholder:text-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-400
      "
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Your Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="
              w-full
              bg-[#07182E]
              border border-cyan-500/40
              text-white
              rounded-lg
              px-4 py-2 pr-14
              placeholder:text-gray-400
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-400
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
    absolute right-3 top-1/2 -translate-y-1/2
    text-cyan-400
    hover:text-cyan-300
    text-lg
    select-none
  "
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            onClick={() => {}}
            type="submit"
            className="
        mt-2
        bg-cyan-500
        hover:bg-cyan-600
        text-[#07182E]
        font-semibold
        py-2
        rounded-xl
        transition
        shadow-lg shadow-cyan-500/30
      "
          >
            Edit Profile
          </button>
        </form>
      </Modal>
    </div>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#7FCFE3] text-base sm:text-lg font-medium">
        {label}
      </span>
      <span
        className={`text-base sm:text-xl font-medium ${
          highlight ? 'text-[#00D1FF]' : 'text-[#EAFBFF]'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function Setting({ title, checked, onClick }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#EAFBFF] text-base sm:text-xl font-medium">
        {title}
      </span>
      <Switch checked={checked} onClick={onClick} />
    </div>
  )
}

function Switch({ checked, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-14 sm:w-16 h-7 sm:h-8 rounded-full flex items-center px-1 cursor-pointer transition-all
      ${
        checked
          ? 'bg-gradient-to-r from-[#00D1FF] to-[#00A7CC]'
          : 'bg-[#123B52]'
      }`}
    >
      <div
        className={`w-6 h-6 sm:w-6 sm:h-6 rounded-full bg-white transition-transform transform
        ${checked ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0'}`}
      />
    </div>
  )
}

export default Settings
