import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import { FiUserPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiUser, FiMail, FiDollarSign, FiCheckCircle, FiSlash } from 'react-icons/fi'
import 'react-toastify/dist/ReactToastify.css'
import { useTheme } from '../../context/ThemeContext'

const API_BASE = 'http://localhost:5000'

function Employees() {
  const [users, setUsers] = useState([])
  const [financeData, setFinanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { isDarkMode } = useTheme()

  const [editUser, setEditUser] = useState({ id: '', userId: '', fullName: '', email: '', hireDate: '', status: '' })
  const [newUser, setNewUser] = useState({ fullName: '', email: '', baseSalary: '' })

  let user = JSON.parse(localStorage.getItem('user'))

  const getNow = () => new Date().toISOString().split('T')[0]
  const generateUserId = () => users.length === 0 ? 101 : Math.max(...users.map((u) => u.userId || 100)) + 1
  const generateEmployeeId = () => users.length === 0 ? '1' : (Math.max(...users.map((u) => parseInt(u.id) || 0)) + 1).toString()

  const fetchData = async () => {
    try {
      const [emp, fin] = await Promise.all([axios.get(`${API_BASE}/employees`), axios.get(`${API_BASE}/employeeFinance`)])
      setUsers(emp.data); setFinanceData(fin.data)
    } catch { toast.error('Error loading data') }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchData() }, [])

  const getEmployeeSalary = (empId) => {
    const record = financeData.find((f) => f.employeeId === empId)
    if (!record || !record.monthly || record.monthly.length === 0) return 0
    return record.monthly[0].baseSalary || 0
  }

  const filteredUsers = users.filter((u) =>
    [u.fullName, u.email, u.userId].some((f) => f?.toString().toLowerCase().includes(search.toLowerCase()))
  )

  const handleAdd = async () => {
    if (!newUser.fullName || !newUser.email || !newUser.baseSalary) return toast.warn('Please fill all fields')
    try {
      setLoading(true)
      const empId = generateEmployeeId()
      await axios.post(`${API_BASE}/employees`, { ...newUser, id: empId, userId: generateUserId(), role: 'employee', hireDate: getNow(), status: 'active' })
      await axios.post(`${API_BASE}/employeeFinance`, { employeeId: empId, year: 2026, monthly: Array.from({ length: 12 }, (_, i) => ({ month: `2026-${String(i + 1).padStart(2, '0')}`, baseSalary: parseInt(newUser.baseSalary), status: 'reviewed' })) })
      toast.success('Employee added')
      setAddOpen(false); setNewUser({ fullName: '', email: '', baseSalary: '' }); fetchData()
      await axios.post(`${API_BASE}/logs`, { userName: user.name, action: 'create', date: new Date().toISOString(), page: 'EMPLOYEES' })
    } catch { toast.error('Error') } finally { setLoading(false) }
  }

  const handleEdit = async () => {
    if (!editUser.fullName || !editUser.email) return toast.warn('Please fill all fields')
    try {
      setLoading(true)
      await axios.put(`${API_BASE}/employees/${editUser.id}`, editUser)
      toast.success('Updated')
      setEditOpen(false); fetchData()
      await axios.post(`${API_BASE}/logs`, { userName: user.name, action: 'update', date: new Date().toISOString(), page: 'EMPLOYEES' })
    } catch { toast.error('Error') } finally { setLoading(false) }
  }

  const handleDelete = async (employee) => {
    if (!window.confirm(`Delete ${employee.fullName}?`)) return
    try {
      setLoading(true)
      await axios.post(`${API_BASE}/employeesDeleted`, employee)
      await axios.delete(`${API_BASE}/employees/${employee.id}`)
      toast.success('Deleted')
      fetchData()
      await axios.post(`${API_BASE}/logs`, { userName: user.name, action: 'delete', date: new Date().toISOString(), page: 'EMPLOYEES' })
    } catch { toast.error('Error') } finally { setLoading(false) }
  }

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-primary)]">
      <div className="w-14 h-14 border-2 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin" />
      <p className="mt-5 text-cyan-500/60 font-bold uppercase tracking-[0.3em] text-xs">Loading</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[5%] w-[35%] h-[35%] bg-cyan-900/8 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[5%] w-[30%] h-[30%] bg-blue-900/8 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-[1500px] mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-fadeInUp">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">EMPLOYEES</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-xs font-medium mt-1.5 tracking-wider uppercase">Manage team members & compensation</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-cyan-400 transition-colors" />
              <input className="glass rounded-2xl py-2.5 pl-11 pr-4 w-full md:w-72 outline-none focus:border-cyan-500/40 transition-all text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setAddOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-[var(--text-primary)] px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30">
              <FiUserPlus /> Add
            </button>
          </div>
        </header>

        {/* Table Container */}
        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-500/10 animate-fadeInUp stagger-1 opacity-0">
          <div className="absolute inset-0 bg-[var(--bg-secondary)]" />
          <div className="noise absolute inset-0 rounded-[2rem]" />
          <div className="relative overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-cyan-500/10">
                <tr>
                  {['Employee', 'ID', 'Salary', 'Joined', 'Status', ''].map((h) => (
                    <th key={h} className={`p-5 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ${h === '' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredUsers.length > 0 ? filteredUsers.map((u, i) => (
                  <tr key={u.id} className="group hover:bg-white/[0.02] transition-all duration-300 animate-fadeInUp opacity-0" style={{ animationDelay: `${i * 0.04}s` }}>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/5 border border-cyan-500/15 flex items-center justify-center">
                          <FiUser size={14} className="text-cyan-400/70" />
                        </div>
                        <div>
                          <div className="font-bold text-[var(--text-primary)] text-sm group-hover:text-cyan-400 transition-colors">{u.fullName}</div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-medium">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] bg-white/[0.03] px-2.5 py-1 rounded-lg border border-cyan-500/10">#{u.userId}</span>
                    </td>
                    <td className="p-5">
                      <span className="text-sm font-bold text-[var(--text-primary)]">{getEmployeeSalary(u.id).toLocaleString('en-US')} UZS</span>
                    </td>
                    <td className="p-5 text-sm text-[var(--text-secondary)] font-medium">{u.hireDate}</td>
                    <td className="p-5">
                      <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${u.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {u.status === 'active' ? <FiCheckCircle size={12} /> : <FiSlash size={12} />}
                        {u.status}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditUser(u); setEditOpen(true) }} className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 hover:text-[var(--text-primary)] transition-all"><FiEdit2 size={13} /></button>
                        <button onClick={() => handleDelete(u)} className="w-8 h-8 bg-red-500/[0.06] text-red-400/70 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-[var(--text-primary)] transition-all"><FiTrash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="p-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/[0.02] border border-cyan-500/10 flex items-center justify-center"><FiUser className="text-2xl text-[var(--text-secondary)]" /></div>
                    <p className="text-[var(--text-secondary)] font-bold text-lg">No employees found</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {(addOpen || editOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeInScale">
          <div className="glass-strong w-full max-w-md rounded-[2rem] shadow-2xl">
            <div className="p-6 border-b border-cyan-500/10 flex justify-between items-center">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{addOpen ? 'New Employee' : 'Edit Employee'}</h2>
              <button onClick={() => { setAddOpen(false); setEditOpen(false) }} className="w-8 h-8 rounded-xl bg-cyan-500/5 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 transition-all"><FiX size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              {addOpen ? (
                <>
                  <ModalInput label="Full Name" icon={<FiUser />} value={newUser.fullName} onChange={(v) => setNewUser({ ...newUser, fullName: v })} />
                  <ModalInput label="Email" icon={<FiMail />} type="email" value={newUser.email} onChange={(v) => setNewUser({ ...newUser, email: v })} />
                  <ModalInput label="Base Salary" icon={<FiDollarSign />} type="number" value={newUser.baseSalary} onChange={(v) => setNewUser({ ...newUser, baseSalary: v })} />
                </>
              ) : (
                <>
                  <ModalInput label="Full Name" icon={<FiUser />} value={editUser.fullName} onChange={(v) => setEditUser({ ...editUser, fullName: v })} />
                  <ModalInput label="Email" icon={<FiMail />} value={editUser.email} onChange={(v) => setEditUser({ ...editUser, email: v })} />
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Status</label>
                    <select className="w-full bg-[var(--bg-secondary)] border border-cyan-500/10 rounded-xl p-2.5 outline-none focus:border-cyan-500/40 text-sm text-[var(--text-primary)]" value={editUser.status} onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}>
                      <option value="active">Active</option><option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="p-6 flex gap-3">
              <button onClick={() => { setAddOpen(false); setEditOpen(false) }} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-[var(--text-secondary)] hover:bg-cyan-500/5 transition-all text-sm">Cancel</button>
              <button onClick={addOpen ? handleAdd : handleEdit} className="flex-1 px-4 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-[var(--text-primary)] shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 active:scale-[0.98] transition-all text-sm">
                {addOpen ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer theme={isDarkMode ? "dark" : "light"} position="bottom-right" autoClose={2000} toastClassName="!bg-[var(--bg-secondary)] !border !border-cyan-500/10 !rounded-2xl !shadow-2xl" />
    </div>
  )
}

const ModalInput = ({ label, icon, value, onChange, type = 'text' }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">{icon}</div>
      <input type={type} className="w-full bg-[var(--bg-secondary)] border border-cyan-500/10 rounded-xl py-2.5 pl-11 pr-4 outline-none focus:border-cyan-500/40 transition-all text-sm text-[var(--text-primary)]" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  </div>
)

export default Employees
