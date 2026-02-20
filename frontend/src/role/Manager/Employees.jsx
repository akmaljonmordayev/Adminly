import React, { useEffect, useState, useMemo } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import {
  FiUserPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUser,
  FiMail,
  FiDollarSign,
  FiCheckCircle,
  FiSlash,
} from 'react-icons/fi'
import 'react-toastify/dist/ReactToastify.css'

const API_BASE = 'http://localhost:5000'

function Employees() {
  const [users, setUsers] = useState([])
  const [financeData, setFinanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [search, setSearch] = useState('')

  const [editUser, setEditUser] = useState({
    id: '',
    userId: '',
    fullName: '',
    email: '',
    hireDate: '',
    status: '',
  })
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    baseSalary: '',
  })

  const user = useMemo(() => JSON.parse(localStorage.getItem('user')), [])

  const getNow = () => new Date().toISOString().split('T')[0]
  const generateUserId = () =>
    users.length === 0
      ? 101
      : Math.max(...users.map((u) => u.userId || 100)) + 1
  const generateEmployeeId = () =>
    users.length === 0
      ? '1'
      : (Math.max(...users.map((u) => parseInt(u.id) || 0)) + 1).toString()

  const fetchData = async () => {
    try {
      const [emp, fin] = await Promise.all([
        axios.get(`${API_BASE}/employees`),
        axios.get(`${API_BASE}/employeeFinance`),
      ])
      setUsers(emp.data)
      setFinanceData(fin.data)
    } catch (e) {
      toast.error('Error loading data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getEmployeeSalary = (empId) => {
    const record = financeData.find((f) => f.employeeId === empId)
    if (!record || !record.monthly || record.monthly.length === 0) return 0
    return record.monthly[0].baseSalary || 0
  }

  const filteredUsers = users.filter((u) =>
    [u.fullName, u.email, u.userId].some((f) =>
      f?.toString().toLowerCase().includes(search.toLowerCase()),
    ),
  )

  const handleAdd = async () => {
    if (!newUser.fullName || !newUser.email || !newUser.baseSalary)
      return toast.warn('Please fill all fields')
    try {
      setLoading(true)
      const empId = generateEmployeeId()
      const payload = {
        ...newUser,
        id: empId,
        userId: generateUserId(),
        role: 'employee',
        hireDate: getNow(),
        status: 'active',
      }

      await axios.post(`${API_BASE}/employees`, payload)
      await axios.post(`${API_BASE}/employeeFinance`, {
        employeeId: empId,
        year: 2026,
        monthly: Array.from({ length: 12 }, (_, i) => ({
          month: `2026-${String(i + 1).padStart(2, '0')}`,
          baseSalary: parseInt(newUser.baseSalary),
          status: 'reviewed',
        })),
      })

      toast.success('Employee added successfully')
      setAddOpen(false)
      setNewUser({ fullName: '', email: '', baseSalary: '' })
      fetchData()
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete?')) return
    try {
      setLoading(true)
      await axios.delete(`${API_BASE}/employees/${id}`)
      toast.success('Deleted')
      fetchData()
    } catch (e) {
      toast.error('Error deleting employee')
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617]">
        <div className="w-10 h-10 border-2 border-slate-800 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 text-xs tracking-widest uppercase">
          Fetching data
        </p>
      </div>
    )

  return (
    <div className="min-h-screen bg-[#020617] p-6 lg:p-10 text-slate-300 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Employees
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage team members and compensation
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              className="bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 w-full md:w-72 outline-none focus:border-cyan-500/50 transition-all text-sm text-white"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all active:scale-95"
          >
            <FiUserPlus /> Add Employee
          </button>
        </div>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/40 border-b border-slate-800">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  User ID
                </th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-cyan-500">
                  Salary ($)
                </th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-500 border border-slate-700">
                          <FiUser size={18} />
                        </div>
                        <div>
                          <div className="font-medium text-slate-100">
                            {u.fullName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">
                        #{u.userId}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-semibold text-slate-200">
                        {getEmployeeSalary(u.id).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{u.hireDate}</td>
                    <td className="p-4">
                      <div
                        className={`flex items-center gap-1.5 text-xs font-medium ${
                          u.status === 'active'
                            ? 'text-emerald-500'
                            : 'text-rose-500'
                        }`}
                      >
                        {u.status === 'active' ? (
                          <FiCheckCircle />
                        ) : (
                          <FiSlash />
                        )}
                        {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditUser(u)
                          setEditOpen(true)
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:text-cyan-500 hover:bg-slate-800 transition-all"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-slate-800 transition-all"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-10 text-center text-slate-600 text-sm italic"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {(addOpen || editOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">
                {addOpen ? 'New Employee' : 'Edit Employee'}
              </h2>
              <button
                onClick={() => {
                  setAddOpen(false)
                  setEditOpen(false)
                }}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {addOpen ? (
                <>
                  <ModalInput
                    label="Full Name"
                    icon={<FiUser />}
                    value={newUser.fullName}
                    onChange={(v) => setNewUser({ ...newUser, fullName: v })}
                  />
                  <ModalInput
                    label="Email Address"
                    icon={<FiMail />}
                    type="email"
                    value={newUser.email}
                    onChange={(v) => setNewUser({ ...newUser, email: v })}
                  />
                  <ModalInput
                    label="Base Salary ($)"
                    icon={<FiDollarSign />}
                    type="number"
                    value={newUser.baseSalary}
                    onChange={(v) => setNewUser({ ...newUser, baseSalary: v })}
                  />
                </>
              ) : (
                <>
                  <ModalInput
                    label="Full Name"
                    icon={<FiUser />}
                    value={editUser.fullName}
                    onChange={(v) => setEditUser({ ...editUser, fullName: v })}
                  />
                  <ModalInput
                    label="Email Address"
                    icon={<FiMail />}
                    value={editUser.email}
                    onChange={(v) => setEditUser({ ...editUser, email: v })}
                  />
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                      Status
                    </label>
                    <select
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-cyan-500 text-sm text-white"
                      value={editUser.status}
                      onChange={(e) =>
                        setEditUser({ ...editUser, status: e.target.value })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 flex gap-3">
              <button
                onClick={() => {
                  setAddOpen(false)
                  setEditOpen(false)
                }}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium text-slate-500 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={
                  addOpen
                    ? handleAdd
                    : () => {
                        /* Handle Edit logic */
                      }
                }
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-600 transition-all"
              >
                {addOpen ? 'Create' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer theme="dark" position="bottom-right" autoClose={2000} />
    </div>
  )
}

const ModalInput = ({ label, icon, value, onChange, type = 'text' }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
        {icon}
      </div>
      <input
        type={type}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 outline-none focus:border-cyan-500 transition-all text-sm text-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
)

export default Employees
