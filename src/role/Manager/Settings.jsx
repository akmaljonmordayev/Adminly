import { useTheme } from '../../context/ThemeContext';
import React, { useEffect, useState } from 'react'
import {
  FiUser, FiMail, FiLock, FiBell, FiShield, FiMonitor, FiLogOut,
  FiChevronRight, FiCheck, FiCamera, FiEye, FiEyeOff, FiMoon, FiSun,
  FiDatabase, FiGlobe, FiSmartphone
} from 'react-icons/fi'
import { Modal, ConfigProvider, theme, Switch as AntSwitch } from 'antd'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'

function Settings() {
  const user = JSON.parse(localStorage.getItem('user'))
  const { isDarkMode, toggleTheme } = useTheme();
  const [data, setData] = useState({})
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('account')

  // Settings State
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    twoFA: false,
    privateMode: false,
    autoLogout: true,
    saveSession: true,
    developerMode: false,
    compactView: false,
    language: 'English'
  })

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const getData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/users/${user.id}`)
      setData(res.data)
      setEditForm({
        name: res.data.name || '',
        email: res.data.email || '',
        password: res.data.password || '',
        confirmPassword: res.data.password || ''
      })
    } catch (err) {
      console.error('Fetch settings error:', err)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (editForm.password !== editForm.confirmPassword) {
      return toast.error('Passwords do not match!')
    }

    setLoading(true)
    try {
      const updatedUser = {
        ...data,
        name: editForm.name,
        email: editForm.email,
        password: editForm.password,
      }

      await axios.put(`http://localhost:5000/users/${user.id}`, updatedUser)

      localStorage.setItem('user', JSON.stringify({
        ...user,
        name: editForm.name,
        email: editForm.email,
      }))

      await axios.post('http://localhost:5000/logs', {
        userName: user.name,
        action: 'UPDATE_PROFILE',
        date: new Date().toISOString(),
        page: 'SETTINGS',
      })

      setIsEditModalOpen(false)
      getData()
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error('Update failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    toast.info(`${key.charAt(0).toUpperCase() + key.slice(1)} updated`)
  }

  if (!user) return null

  const tabs = [
    { id: 'account', label: 'Account', icon: <FiUser /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'security', label: 'Security', icon: <FiShield /> },
    { id: 'system', label: 'System', icon: <FiMonitor /> },
  ]

  return (
    <ConfigProvider theme={{ algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <main className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8 animate-fadeIn">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="animate-fadeInUp">
              <h1 className="text-4xl font-black tracking-tighter">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase">Settings</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-xs font-bold mt-1 tracking-[0.2em] uppercase opacity-70">
                Manage your administrative experience
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3 space-y-2 animate-fadeInUp stagger-1 opacity-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-350 ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/5 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10'
                    : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                    }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-sm tracking-wide">{tab.label}</span>
                  {activeTab === tab.id && <FiChevronRight className="ml-auto animate-bounce-x" />}
                </button>
              ))}

              <div className="pt-8 border-t border-white/5 mt-8">
                <button
                  onClick={() => {
                    localStorage.removeItem('user')
                    window.location.reload()
                  }}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                >
                  <FiLogOut className="text-lg" />
                  <span className="text-sm tracking-wide">Sign Out</span>
                </button>
              </div>
            </aside>

            {/* Content Area */}
            <section className="lg:col-span-9 space-y-6 animate-fadeInUp stagger-2 opacity-0">
              {activeTab === 'account' && (
                <div className="space-y-6">
                  {/* Profile Card */}
                  <div className="glass-strong rounded-[2.5rem] p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-cyan-500/10" />

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-cyan-500 to-blue-600 p-1">
                          <div className="w-full h-full rounded-[2.4rem] bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden">
                            {data.avatar ? (
                              <img src={data.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <FiUser size={48} className="text-cyan-400/50" />
                            )}
                          </div>
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--bg-primary)] border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 shadow-xl hover:scale-110 transition-transform active:scale-95">
                          <FiCamera size={18} />
                        </button>
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">{data.name}</h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                          <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest leading-none">
                            {data.role || 'Administrator'}
                          </span>
                          <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest leading-none">
                            Active Session
                          </span>
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm mt-4 font-medium max-w-md opacity-70">
                          {data.email} · Last login: {new Date().toLocaleDateString()}
                        </p>
                      </div>

                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-[var(--text-primary)] rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all active:scale-95"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  {/* Personal Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-[2rem] p-6">
                      <p className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-4">Account Details</p>
                      <div className="space-y-4">
                        <DetailRow icon={<FiMail />} label="Email Address" value={data.email} />
                        <DetailRow icon={<FiSmartphone />} label="Phone Number" value="+998 90 123 45 67" />
                        <DetailRow icon={<FiGlobe />} label="Timezone" value="Tashkent (GMT+5)" />
                      </div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-[2rem] p-6">
                      <p className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-4">Workspace Info</p>
                      <div className="space-y-4">
                        <DetailRow icon={<FiDatabase />} label="Server Status" value="Healthy" color="text-emerald-400" />
                        <DetailRow icon={<FiMonitor />} label="Devices connected" value="3 active" />
                        <DetailRow icon={<FiShield />} label="Privileges" value="Full Access" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-[2rem] p-8 space-y-2">
                  <SettingItem
                    icon={<FiBell />}
                    title="Push Notifications"
                    desc="Get real-time alerts on your desktop"
                    active={settings.notifications}
                    toggle={() => toggleSetting('notifications')}
                  />
                  <SettingItem
                    icon={<FiMail />}
                    title="Email Alerts"
                    desc="Receive summaries and critical logs via email"
                    active={settings.emailAlerts}
                    toggle={() => toggleSetting('emailAlerts')}
                  />
                  <SettingItem
                    icon={<FiSmartphone />}
                    title="Mobile Analytics"
                    desc="Send activity reports to your mobile device"
                    active={true}
                    toggle={() => { }}
                  />
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-[2rem] p-8 space-y-2">
                  <SettingItem
                    icon={<FiShield />}
                    title="Two-Factor Authentication"
                    desc="Add an extra layer of security to your account"
                    active={settings.twoFA}
                    toggle={() => toggleSetting('twoFA')}
                  />
                  <SettingItem
                    icon={<FiLock />}
                    title="Private Mode"
                    desc="Hide your active status and recent activities"
                    active={settings.privateMode}
                    toggle={() => toggleSetting('privateMode')}
                  />
                  <SettingItem
                    icon={<FiLogOut />}
                    title="Session Timeout"
                    desc="Automatically logout after 30 minutes of inactivity"
                    active={settings.autoLogout}
                    toggle={() => toggleSetting('autoLogout')}
                  />
                </div>
              )}

              {activeTab === 'system' && (
                <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-[2rem] p-8 space-y-2">
                  <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-cyan-500/10 text-cyan-400' : 'bg-amber-500/10 text-amber-500'}`}>
                        {isDarkMode ? <FiMoon /> : <FiSun />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">Theme Mode</h4>
                        <p className="text-[10px] text-[var(--text-secondary)] font-medium">Switch between light and dark aesthetics</p>
                      </div>
                    </div>
                    <AntSwitch checked={isDarkMode} onChange={toggleTheme} className="bg-cyan-600" />
                  </div>
                  <SettingItem
                    icon={<FiDatabase />}
                    title="Save Sessions"
                    desc="Remember your filters and current page status"
                    active={settings.saveSession}
                    toggle={() => toggleSetting('saveSession')}
                  />
                  <SettingItem
                    icon={<FiMonitor />}
                    title="Developer Tools"
                    desc="Enable advanced debugging and logging features"
                    active={settings.developerMode}
                    toggle={() => toggleSetting('developerMode')}
                  />
                </div>
              )}
            </section>
          </div>
        </div>

        {/* PREMIUM EDIT MODAL */}
        <Modal
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          footer={null}
          width={700}
          zIndex={1000}
          centered
          closeIcon={<div className="bg-white/5 p-2 rounded-xl text-[var(--text-secondary)] hover:text-red-400 transition-colors">✕</div>}
          className="premium-modal"
          styles={{
            mask: { backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.6)' },
            content: {
              padding: 0,
              borderRadius: '2.5rem',
              overflow: 'hidden',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none'
            }
          }}
        >
          <div className="glass-strong border border-white/10 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
            {/* Left Decor */}
            <div className="w-full md:w-1/3 bg-gradient-to-br from-cyan-600 to-blue-700 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="relative z-10">
                <div className="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 mx-auto shadow-2xl">
                  <FiUser size={40} className="text-white" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Profile Update</h3>
                <p className="text-white/60 text-[10px] font-bold mt-2 uppercase tracking-widest leading-relaxed">
                  Refine your identity <br /> in the system
                </p>
              </div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 blur-[60px] rounded-full" />
            </div>

            {/* Right Form */}
            <div className="flex-1 p-8 bg-[var(--bg-secondary)]">
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <div className="relative group">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[var(--bg-primary)] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-cyan-500/40 transition-all text-sm text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-[var(--bg-primary)] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-cyan-500/40 transition-all text-sm text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] ml-1">New Password</label>
                    <div className="relative group">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={editForm.password}
                        onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full bg-[var(--bg-primary)] border border-white/5 rounded-2xl py-3.5 pl-12 pr-12 outline-none focus:border-cyan-500/40 transition-all text-sm text-[var(--text-primary)]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
                      >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] ml-1">Confirm</label>
                    <div className="relative group">
                      <FiCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-emerald-400 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={editForm.confirmPassword}
                        onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full bg-[var(--bg-primary)] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-emerald-500/40 transition-all text-sm text-[var(--text-primary)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-[var(--text-secondary)] hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-[var(--text-primary)] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>

        <ToastContainer
          theme={isDarkMode ? 'dark' : 'light'}
          position="bottom-right"
          autoClose={2500}
          toastClassName="!rounded-2xl !bg-[var(--bg-secondary)] !border !border-white/5 !shadow-2xl"
        />
      </main>
    </ConfigProvider>
  )
}

const DetailRow = ({ icon, label, value, color = "text-[var(--text-primary)]" }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--text-secondary)] group-hover:text-cyan-400 transition-colors">
        {icon}
      </div>
      <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-wider">{label}</span>
    </div>
    <span className={`text-xs font-bold ${color}`}>{value}</span>
  </div>
)

const SettingItem = ({ icon, title, desc, active, toggle }) => (
  <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors group">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[var(--text-secondary)] group-hover:text-cyan-400 transition-colors ${active ? 'text-cyan-400' : ''}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-[var(--text-primary)] tracking-wide">{title}</h4>
        <p className="text-[10px] text-[var(--text-secondary)] font-medium opacity-70">{desc}</p>
      </div>
    </div>
    <AntSwitch checked={active} onChange={toggle} className={active ? "bg-cyan-600" : ""} />
  </div>
)

export default Settings
