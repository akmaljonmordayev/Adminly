import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'

import {
  HiOutlineUserAdd,
  HiOutlineSearch,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineTrash,
  HiOutlinePencilAlt,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineX,
} from 'react-icons/hi'
import { BiLoaderAlt, BiUserCircle } from 'react-icons/bi'
import { FiUsers } from 'react-icons/fi'

// --- CUSTOM MODAL COMPONENT ---
const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  okText = 'Save',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#111827] border border-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-white tracking-tight">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-full transition-all"
            >
              <HiOutlineX className="text-xl" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-6">{children}</div>

          {/* Footer */}
          <div className="flex items-center gap-3 mt-10">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl text-slate-400 bg-slate-800/50 hover:bg-slate-800 font-bold transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold shadow-lg shadow-cyan-900/20 transition-all active:scale-95"
            >
              {okText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Employees() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const [editUser, setEditUser] = useState({
    id: '',
    userId: '',
    fullName: '',
    email: '',
    role: '',
    hireDate: '',
    status: '',
  })

  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    role: 'employee',
    baseSalary: '',
  })

  const [search, setSearch] = useState('')

  const getNow = () => new Date().toISOString().split('T')[0]

  const getData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/employees')
      setUsers(res.data)
      setLoading(false)
    } catch (error) {
      toast.error('Error loading employees')
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.userId?.toString().includes(search),
  )

  const handleAdd = async () => {
    if (!newUser.fullName || !newUser.email || !newUser.baseSalary) {
      toast.warn('Please fill in all required fields.')
      return
    }
    try {
      setLoading(true)
      const newId = (
        Math.max(...users.map((u) => parseInt(u.id) || 0)) + 1
      ).toString()
      const employeeData = {
        id: newId,
        userId: Math.max(...users.map((u) => u.userId || 100)) + 1,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        hireDate: getNow(),
        status: 'active',
      }

      await axios.post('http://localhost:5000/employees', employeeData)
      toast.success('Employee added successfully!')
      setAddOpen(false)
      setNewUser({ fullName: '', email: '', role: 'employee', baseSalary: '' })
      getData()
    } catch (error) {
      toast.error('An error occurred while adding.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    try {
      setLoading(true)
      await axios.put(
        `http://localhost:5000/employees/${editUser.id}`,
        editUser,
      )
      toast.success('Information updated successfully!')
      setEditOpen(false)
      getData()
    } catch (error) {
      toast.error('Update error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?'))
      return
    try {
      setLoading(true)
      await axios.delete(`http://localhost:5000/employees/${id}`)
      toast.success('Employee deleted')
      getData()
    } catch (error) {
      toast.error('Deletion error occurred.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && users.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f1a]">
        <BiLoaderAlt className="w-12 h-12 text-cyan-500 animate-spin" />
        <p className="mt-4 text-cyan-500 font-medium tracking-widest uppercase text-xs">
          Loading System...
        </p>
      </div>
    )

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="w-2 h-10 bg-cyan-500 rounded-full inline-block"></span>
              Employee Management
            </h1>
            <p className="text-slate-500 mt-2 text-sm md:text-base">
              Company workforce administration panel.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
              <input
                className="w-full sm:w-72 pl-12 pr-4 py-3 bg-[#151b2b] border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm text-white"
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-cyan-900/20 active:scale-95 whitespace-nowrap"
            >
              <HiOutlineUserAdd className="text-xl" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-[#111827]/80 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/30 text-slate-400 border-b border-slate-800">
                  <th className="p-6 text-xs font-bold uppercase tracking-widest">
                    Employee
                  </th>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest">
                    Role
                  </th>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest">
                    Joined Date
                  </th>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest">
                    Status
                  </th>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-cyan-500/[0.02] transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-cyan-400 border border-slate-700 group-hover:border-cyan-500/50 transition-all duration-300">
                            <BiUserCircle className="text-3xl" />
                          </div>
                          {u.status === 'active' && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#111827] rounded-full"></span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                            {u.fullName}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <HiOutlineMail className="text-cyan-600" />{' '}
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                        <HiOutlineShieldCheck className="text-cyan-500" />{' '}
                        {u.role}
                      </span>
                    </td>
                    <td className="p-6 text-sm">
                      <div className="flex flex-col">
                        <span className="text-slate-300 flex items-center gap-1">
                          <HiOutlineCalendar className="text-slate-500" />{' '}
                          {u.hireDate}
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono">
                          ID: {u.userId}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          u.status === 'active'
                            ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/5 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === 'active'
                              ? 'bg-emerald-400 animate-pulse'
                              : 'bg-rose-400'
                          }`}
                        />
                        {u.status}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setEditUser(u)
                            setEditOpen(true)
                          }}
                          className="p-3 bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-xl transition-all"
                        >
                          <HiOutlinePencilAlt className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-3 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-all"
                        >
                          <HiOutlineTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                <FiUsers className="text-6xl mb-4 opacity-20" />
                <p className="font-medium">
                  No employees found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* ADD EMPLOYEE MODAL */}
      <CustomModal
        title="New Employee"
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onConfirm={handleAdd}
        okText="Create Account"
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <HiOutlineUserAdd className="text-cyan-500" /> Full Name
            </label>
            <input
              className="w-full px-4 py-4 bg-[#0b0f1a] border border-slate-800 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 outline-none text-white transition-all"
              placeholder="Enter Name"
              value={newUser.fullName}
              onChange={(e) =>
                setNewUser({ ...newUser, fullName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <HiOutlineMail className="text-cyan-500" /> Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-4 bg-[#0b0f1a] border border-slate-800 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 outline-none text-white transition-all"
              placeholder="Enter Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <HiOutlineCurrencyDollar className="text-cyan-500" /> Base Salary
            </label>
            <input
              type="number"
              className="w-full px-4 py-4 bg-[#0b0f1a] border border-slate-800 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 outline-none text-white transition-all"
              placeholder="Enter Base Salary"
              value={newUser.baseSalary}
              onChange={(e) =>
                setNewUser({ ...newUser, baseSalary: e.target.value })
              }
            />
          </div>
        </div>
      </CustomModal>

      {/* EDIT EMPLOYEE MODAL */}
      <CustomModal
        title="Edit Employee"
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onConfirm={handleEdit}
        okText="Update Info"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
            <span className="text-[10px] font-black uppercase text-cyan-500 tracking-tighter">
              System ID
            </span>
            <span className="font-mono text-cyan-400 font-bold tracking-widest">
              {editUser.userId}
            </span>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Full Name
            </label>
            <input
              className="w-full px-4 py-4 bg-[#0b0f1a] border border-slate-800 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 outline-none text-white transition-all"
              value={editUser.fullName}
              onChange={(e) =>
                setEditUser({ ...editUser, fullName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Employment Status
            </label>
            <select
              className="w-full px-4 py-4 bg-[#0b0f1a] border border-slate-800 rounded-2xl outline-none text-white focus:ring-2 focus:ring-cyan-500/50"
              value={editUser.status}
              onChange={(e) =>
                setEditUser({ ...editUser, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </CustomModal>

      <ToastContainer position="bottom-right" autoClose={2500} theme="dark" />
    </div>
  )
}

export default Employees
