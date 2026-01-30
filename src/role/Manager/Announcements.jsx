import React, { useEffect, useState } from 'react'
import { Modal, ConfigProvider, theme } from 'antd'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  HiOutlineCalendarDays,
  HiOutlineTrash,
  HiOutlinePencilSquare,
} from 'react-icons/hi2'

const Announcements = () => {
  const API = 'http://localhost:5000/announcements'
  const DELETED_API = 'http://localhost:5000/announcementsDeleted'

  const [announcements, setAnnouncements] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newText, setNewText] = useState('')
  const [date, setDate] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnn, setEditingAnn] = useState(null)

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch(console.error)
  }, [])

  /* ===== ACTIVE / NO ACTIVE ===== */
  const toggleStatus = async (ann) => {
    const updated = {
      ...ann,
      status: ann.status === 'Active' ? 'No Active' : 'Active',
    }

    await fetch(`${API}/${ann.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })

    setAnnouncements(
      announcements.map((a) => (a.id === ann.id ? updated : a)),
    )
  }

  const addAnnouncement = async () => {
    if (!newTitle || !newText) return

    const newAnn = {
      title: newTitle,
      text: newText,
      date: date || 'Jan 23, 2026',
      status: 'Active',
    }

    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAnn),
    })

    const saved = await res.json()
    setAnnouncements([...announcements, saved])
    setNewTitle('')
    setNewText('')
    setDate('')
    toast.success('Published', { theme: 'dark' })
  }

  const deleteAnnouncement = async (id) => {
    const item = announcements.find((a) => a.id === id)
    if (!item) return

    await fetch(DELETED_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })

    await fetch(`${API}/${id}`, { method: 'DELETE' })
    setAnnouncements(announcements.filter((a) => a.id !== id))
  }

  const openEditModal = (a) => {
    setEditingAnn(a)
    setNewTitle(a.title)
    setNewText(a.text)
    setDate(a.date)
    setIsModalOpen(true)
  }

  const updateAnnouncement = async () => {
    const updated = { ...editingAnn, title: newTitle, text: newText, date }

    await fetch(`${API}/${editingAnn.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })

    setAnnouncements(
      announcements.map((a) => (a.id === editingAnn.id ? updated : a)),
    )

    setIsModalOpen(false)
  }

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="min-h-screen bg-[#020617] px-6 py-12 text-white">
        <ToastContainer />

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="bg-slate-900/40 rounded-3xl border border-white/5 p-7"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{a.title}</h3>

                {/* STATUS */}
                <div
                  onClick={() => toggleStatus(a)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer border
                    ${
                      a.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}
                >
                  {a.status}
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-6">{a.text}</p>

              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <HiOutlineCalendarDays />
                  <span className="text-xs">{a.date}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(a)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20"
                  >
                    <HiOutlinePencilSquare />
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(a.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20"
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal
          open={isModalOpen}
          onOk={updateAnnouncement}
          onCancel={() => setIsModalOpen(false)}
          centered
        >
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full mb-3 p-3 bg-slate-900 border rounded"
          />
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="w-full p-3 bg-slate-900 border rounded"
          />
        </Modal>
      </div>
    </ConfigProvider>
  )
}

export default Announcements
