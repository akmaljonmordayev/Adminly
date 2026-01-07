import React, { useEffect, useState } from 'react'

function Employees() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete it?')) return
    fetch(`http://localhost:5000/users/${id}`, { method: 'DELETE' }).then(
      () => {
        setUsers(users.filter((u) => u.id !== id))
      },
    )
  }

  const handleEdit = (user) => {
    const newName = prompt('Edit this name', user.name)
    if (!newName) return
    fetch(`http://localhost:5000/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, name: newName }),
    }).then(() => {
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, name: newName } : u)),
      )
    })
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f172a] backdrop-blur-md">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-32 h-32 border-4 border-t-cyan-500 border-b-cyan-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          <div className="absolute w-24 h-24 border-2 border-cyan-400/30 rounded-full animate-ping"></div>
          <div className="absolute w-20 h-20 border-2 border-r-cyan-300 border-l-cyan-300 border-t-transparent border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
          <div className="relative w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-pulse"></div>
        </div>
        <div className="mt-12 flex flex-col items-center gap-2">
          <span className="text-cyan-400 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
            Yuklanmoqda...
          </span>
          <div className="w-32 h-[2px] bg-slate-800 overflow-hidden rounded-full">
            <div className="w-full h-full bg-cyan-500 animate-[shimmer_1.5s_infinite]"></div>
          </div>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`,
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 text-slate-300">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
          Employees
        </h2>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1e293b]/40 backdrop-blur-xl shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0f172a]/50 text-cyan-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4 text-slate-500">#{user.id}</td>
                  <td className="px-6 py-4 font-medium text-white">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{user.email}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-4 py-1.5 text-xs font-bold text-cyan-400 bg-cyan-400/10 rounded-lg border border-cyan-400/20 hover:bg-cyan-500 hover:text-[#0f172a] transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-4 py-1.5 text-xs font-bold text-red-400 bg-red-400/10 rounded-lg border border-red-400/20 hover:bg-red-500 hover:text-white transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-20 text-center text-slate-500 uppercase tracking-widest text-sm">
              Not found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Employees
