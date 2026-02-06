import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'

function Employees() {
  const [users, setUsers] = useState([])
  const [financeData, setFinanceData] = useState([])
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

  const user = JSON.parse(localStorage.getItem('user'))

  // Get current date
  const getNow = () => {
    const now = new Date()
    return now.toISOString().split('T')[0]
  }

  // Fetch employees
  const getData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/employees')
      setUsers(res.data)
      setLoading(false)
    } catch (error) {
      toast.error('Failed to load employees')
      setLoading(false)
    }
  }

  // Fetch finance data
  const getFinanceData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/employeeFinance')
      setFinanceData(res.data)
    } catch (error) {
      console.error('Failed to load finance data:', error)
    }
  }

  useEffect(() => {
    getData()
    getFinanceData()
  }, [])

  // Filter users by search
  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.userId?.toString().includes(search),
  )

  // Generate new user ID (highest userId + 1)
  const generateUserId = () => {
    if (users.length === 0) return 101
    const maxUserId = Math.max(...users.map((u) => u.userId || 100))
    return maxUserId + 1
  }

  // Generate new employee ID (highest id + 1)
  const generateEmployeeId = () => {
    if (users.length === 0) return '1'
    const maxId = Math.max(...users.map((u) => parseInt(u.id) || 0))
    return (maxId + 1).toString()
  }

  // Create empty finance record for new employee
  const createFinanceRecord = (employeeId, baseSalary) => {
    const months = [
      '2025-01',
      '2025-02',
      '2025-03',
      '2025-04',
      '2025-05',
      '2025-06',
      '2025-07',
      '2025-08',
      '2025-09',
      '2025-10',
      '2025-11',
      '2025-12',
    ]

    return {
      employeeId: employeeId,
      year: 2025,
      monthly: months.map((month) => ({
        month: month,
        baseSalary: parseInt(baseSalary) || 0,
        kpiAmount: 0,
        bonus: 0,
        penalty: 0,
        totalSalary: 0,
        status: 'reviewed',
        paymentDate: '',
        paymentMethod: 'bank',
        comment: '',
      })),
    }
  }

  // ADD EMPLOYEE
  const handleAdd = async () => {
    // Validation
    if (!newUser.fullName || !newUser.email || !newUser.baseSalary) {
      toast.warn('Please fill all required fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUser.email)) {
      toast.warn('Please enter a valid email')
      return
    }

    try {
      setLoading(true)

      const newEmployeeId = generateEmployeeId()
      const newUserId = generateUserId()

      // Create employee data
      const employeeData = {
        id: newEmployeeId,
        userId: newUserId,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        hireDate: getNow(),
        status: 'active',
      }

      // Create employee
      const employeeRes = await axios.post(
        'http://localhost:5000/employees',
        employeeData,
      )

      if (employeeRes.status === 201) {
        // Create finance record
        const financeRecord = createFinanceRecord(
          newEmployeeId,
          newUser.baseSalary,
        )

        await axios.post('http://localhost:5000/employeeFinance', financeRecord)

        // Log action
        try {
          await axios.post('http://localhost:5000/logs', {
            userName: user?.name || 'Unknown',
            action: 'CREATE',
            date: new Date().toISOString(),
            page: 'EMPLOYEES',
          })
        } catch (logError) {
          console.log('Log error:', logError)
        }

        toast.success('Employee created successfully!')
        setAddOpen(false)
        setNewUser({
          fullName: '',
          email: '',
          role: 'employee',
          baseSalary: '',
        })
        getData()
        getFinanceData()
      }
    } catch (error) {
      console.error('Create error:', error)
      toast.error('Failed to create employee')
    } finally {
      setLoading(false)
    }
  }

  // EDIT EMPLOYEE
  const handleEdit = async () => {
    if (!editUser.fullName || !editUser.email) {
      toast.warn('Please fill all required fields')
      return
    }

    try {
      setLoading(true)

      await axios.put(
        `http://localhost:5000/employees/${editUser.id}`,
        editUser,
      )

      // Log action
      try {
        await axios.post('http://localhost:5000/logs', {
          userName: user?.name || 'Unknown',
          action: 'UPDATE',
          date: new Date().toISOString(),
          page: 'EMPLOYEES',
        })
      } catch (logError) {
        console.log('Log error:', logError)
      }

      toast.success('Employee updated successfully!')
      setEditOpen(false)
      getData()
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update employee')
    } finally {
      setLoading(false)
    }
  }

  // DELETE EMPLOYEE
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return
    }

    try {
      setLoading(true)

      // Get employee data for archiving
      const employeeRes = await axios.get(
        `http://localhost:5000/employees/${id}`,
      )
      const employeeData = employeeRes.data

      // Archive employee
      const { id: _, ...archivedEmployee } = employeeData
      await axios.post(
        'http://localhost:5000/employeesDeleted',
        archivedEmployee,
      )

      // Delete employee
      await axios.delete(`http://localhost:5000/employees/${id}`)

      // Find and delete finance record
      const financeRecord = financeData.find((f) => f.employeeId === id)
      if (financeRecord && financeRecord.id) {
        await axios.delete(
          `http://localhost:5000/employeeFinance/${financeRecord.id}`,
        )
      }

      // Log action
      try {
        await axios.post('http://localhost:5000/logs', {
          userName: user?.name || 'Unknown',
          action: 'DELETE',
          date: new Date().toISOString(),
          page: 'EMPLOYEES',
        })
      } catch (logError) {
        console.log('Log error:', logError)
      }

      toast.success('Employee deleted successfully!')
      getData()
      getFinanceData()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete employee')
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <div style={loadingContainer}>
        <div style={loadingSpinner}></div>
        <p style={loadingText}>Loading employees...</p>
      </div>
    )

  return (
    <div style={container}>
      <div style={header}>
        <h1 style={title}>Employee Management</h1>
        <div style={headerActions}>
          <input
            style={searchInput}
            placeholder="🔍 Search by name, email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button style={addButton} onClick={() => setAddOpen(true)}>
            <span style={{ fontSize: '18px', marginRight: '8px' }}>+</span>
            Add Employee
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={tableContainer}>
        <table style={table}>
          <thead>
            <tr style={tableHeaderRow}>
              <th style={th}>#</th>
              <th style={th}>User ID</th>
              <th style={th}>Full Name</th>
              <th style={th}>Email</th>
              <th style={th}>Role</th>
              <th style={th}>Hire Date</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u, index) => (
                <tr key={u.id} style={tableRow}>
                  <td style={td}>{index + 1}</td>
                  <td style={td}>
                    <span style={badge}>{u.userId}</span>
                  </td>
                  <td style={td}>
                    <span style={userName}>{u.fullName}</span>
                  </td>
                  <td style={td}>{u.email}</td>
                  <td style={td}>
                    <span style={roleBadge}>{u.role || 'employee'}</span>
                  </td>
                  <td style={td}>{u.hireDate}</td>
                  <td style={td}>
                    <span
                      style={
                        u.status === 'active'
                          ? statusBadgeActive
                          : statusBadgeInactive
                      }
                    >
                      {u.status}
                    </span>
                  </td>
                  <td style={td}>
                    <button
                      style={editButton}
                      onClick={() => {
                        setEditUser(u)
                        setEditOpen(true)
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={deleteButton}
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={emptyMessage}>
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      <Modal
        title={
          <span
            style={{ color: '#22d3ee', fontSize: '18px', fontWeight: 'bold' }}
          >
            Add New Employee
          </span>
        }
        open={addOpen}
        onOk={handleAdd}
        onCancel={() => {
          setAddOpen(false)
          setNewUser({
            fullName: '',
            email: '',
            role: 'employee',
            baseSalary: '',
          })
        }}
        okText="Create Employee"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            background: '#22d3ee',
            borderColor: '#22d3ee',
            fontWeight: '600',
          },
        }}
        cancelButtonProps={{
          style: {
            borderColor: '#475569',
            color: '#94a3b8',
          },
        }}
        styles={{
          content: {
            background: '#0f172a',
            border: '1px solid #1e293b',
          },
          header: {
            background: '#0f172a',
            borderBottom: '1px solid #1e293b',
          },
          body: {
            background: '#0f172a',
          },
          footer: {
            background: '#0f172a',
            borderTop: '1px solid #1e293b',
          },
        }}
      >
        <div style={modalContent}>
          <div style={inputGroup}>
            <label style={label}>Full Name *</label>
            <input
              style={input}
              placeholder="Enter full name"
              value={newUser.fullName}
              onChange={(e) =>
                setNewUser({ ...newUser, fullName: e.target.value })
              }
            />
          </div>

          <div style={inputGroup}>
            <label style={label}>Email *</label>
            <input
              style={input}
              type="email"
              placeholder="example@company.com"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
          </div>

          <div style={inputGroup}>
            <label style={label}>Role</label>
            <select
              style={input}
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={inputGroup}>
            <label style={label}>Base Salary *</label>
            <input
              style={input}
              type="number"
              placeholder="2200000"
              value={newUser.baseSalary}
              onChange={(e) =>
                setNewUser({ ...newUser, baseSalary: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        title={
          <span
            style={{ color: '#22d3ee', fontSize: '18px', fontWeight: 'bold' }}
          >
            Edit Employee
          </span>
        }
        open={editOpen}
        onOk={handleEdit}
        onCancel={() => {
          setEditOpen(false)
        }}
        okText="Save Changes"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            background: '#22d3ee',
            borderColor: '#22d3ee',
            fontWeight: '600',
          },
        }}
        cancelButtonProps={{
          style: {
            borderColor: '#475569',
            color: '#94a3b8',
          },
        }}
        styles={{
          content: {
            background: '#0f172a',
            border: '1px solid #1e293b',
          },
          header: {
            background: '#0f172a',
            borderBottom: '1px solid #1e293b',
          },
          body: {
            background: '#0f172a',
          },
          footer: {
            background: '#0f172a',
            borderTop: '1px solid #1e293b',
          },
        }}
      >
        <div style={modalContent}>
          <div style={inputGroup}>
            <label style={label}>User ID</label>
            <input
              style={{ ...input, opacity: 0.6 }}
              value={editUser.userId}
              disabled
            />
          </div>

          <div style={inputGroup}>
            <label style={label}>Full Name *</label>
            <input
              style={input}
              value={editUser.fullName}
              onChange={(e) =>
                setEditUser({ ...editUser, fullName: e.target.value })
              }
            />
          </div>

          <div style={inputGroup}>
            <label style={label}>Email *</label>
            <input
              style={input}
              type="email"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />
          </div>

          <div style={inputGroup}>
            <label style={label}>Role</label>
            <select
              style={input}
              value={editUser.role}
              onChange={(e) =>
                setEditUser({ ...editUser, role: e.target.value })
              }
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={inputGroup}>
            <label style={label}>Status</label>
            <select
              style={input}
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
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  )
}

/* ================= STYLES ================= */

const container = {
  padding: '24px',
  minHeight: '100vh',
  background: '#0f172a',
}

const header = {
  marginBottom: '24px',
}

const title = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#f1f5f9',
  marginBottom: '16px',
}

const headerActions = {
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
}

const searchInput = {
  flex: 1,
  padding: '12px 16px',
  borderRadius: '12px',
  background: '#1e293b',
  border: '1px solid #334155',
  color: '#e5e7eb',
  fontSize: '14px',
  outline: 'none',
  transition: 'all 0.3s',
}

const addButton = {
  padding: '12px 24px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  background: '#22d3ee',
  color: '#0f172a',
  fontWeight: '700',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s',
  boxShadow: '0 4px 6px rgba(34, 211, 238, 0.3)',
}

const tableContainer = {
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid #1e293b',
  background: '#0f172a',
}

const table = {
  width: '100%',
  borderCollapse: 'collapse',
}

const tableHeaderRow = {
  background: '#1e293b',
  borderBottom: '2px solid #334155',
}

const th = {
  padding: '16px',
  color: '#22d3ee',
  fontSize: '13px',
  fontWeight: '700',
  textAlign: 'left',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const tableRow = {
  borderBottom: '1px solid #1e293b',
  transition: 'background 0.2s',
}

const td = {
  padding: '16px',
  color: '#e5e7eb',
  fontSize: '14px',
}

const badge = {
  background: '#334155',
  color: '#94a3b8',
  padding: '4px 12px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '600',
}

const userName = {
  color: '#f1f5f9',
  fontWeight: '600',
}

const roleBadge = {
  background: '#1e40af20',
  color: '#60a5fa',
  padding: '4px 12px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'capitalize',
}

const statusBadgeActive = {
  background: '#10b98120',
  color: '#34d399',
  padding: '4px 12px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'capitalize',
}

const statusBadgeInactive = {
  background: '#ef444420',
  color: '#f87171',
  padding: '4px 12px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'capitalize',
}

const editButton = {
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  background: '#22d3ee',
  color: '#0f172a',
  fontWeight: '600',
  fontSize: '13px',
  marginRight: '8px',
  transition: 'all 0.2s',
}

const deleteButton = {
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  background: '#ef4444',
  color: '#fff',
  fontWeight: '600',
  fontSize: '13px',
  transition: 'all 0.2s',
}

const emptyMessage = {
  padding: '48px',
  textAlign: 'center',
  color: '#64748b',
  fontSize: '14px',
}

const modalContent = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '8px 0',
}

const inputGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const label = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#94a3b8',
}

const input = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #334155',
  background: '#1e293b',
  color: '#e5e7eb',
  fontSize: '14px',
  outline: 'none',
  transition: 'all 0.3s',
}

const loadingContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: '#0f172a',
}

const loadingSpinner = {
  width: '48px',
  height: '48px',
  border: '4px solid #1e293b',
  borderTop: '4px solid #22d3ee',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
}

const loadingText = {
  marginTop: '16px',
  color: '#22d3ee',
  fontSize: '16px',
  fontWeight: '600',
}

export default Employees
