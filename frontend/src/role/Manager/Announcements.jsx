import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Modal, ConfigProvider, theme, DatePicker } from 'antd'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import dayjs from 'dayjs'
import {
  HiOutlineCalendarDays,
  HiOutlineTrash,
  HiOutlinePencilSquare,
  HiXMark,
  HiOutlineHashtag,
  HiOutlineChatBubbleLeftRight,
  HiPlus,
  HiMegaphone,
} from 'react-icons/hi2'

const Announcements = () => {
  const API = 'http://localhost:5000/announcements'
  const DELETED_API = 'http://localhost:5000/announcementsDeleted'

  const [announcements, setAnnouncements] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newText, setNewText] = useState('')
  const [date, setDate] = useState('')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnn, setEditingAnn] = useState(null)
  const [editDeadline, setEditDeadline] = useState('')

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch(console.error)
  }, [])

  let user = JSON.parse(localStorage.getItem('user'))

  const addAnnouncement = async () => {
    if (!newTitle || !newText) {
      toast.error('Please fill in all fields', { theme: 'dark' })
      return
    }

    const newAnn = {
      title: newTitle,
      text: newText,
      date: editDeadline
        ? dayjs(editDeadline).format('DD.MM.YYYY')
        : dayjs().format('DD.MM.YYYY'),
      status: 'Active',
    }

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnn),
      })

      if (!res.ok) throw new Error('Failed to add announcement')

      const saved = await res.json()
      setAnnouncements([...announcements, saved])

      try {
        if (!user || !user.name) throw new Error('User not defined')
        toast.success('Task successfully added')
        await axios.post('http://localhost:5000/logs', {
          userName: user.name,
          action: 'CREATE',
          date: new Date().toISOString(),
          page: 'ANNOUNCEMENTS',
        })
      } catch (logError) {
        console.error('Failed to write log:', logError)
      }

      setNewTitle('')
      setNewText('')
      setDate('')
      toast.success('Announcement published successfully', { theme: 'dark' })
    } catch (e) {
      toast.error('Something went wrong', { theme: 'dark' })
      console.error(e)
    }
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
    toast.error('Announcement successfully deleted and archived', {
      theme: 'dark',
    })
    await axios.post('http://localhost:5000/logs', {
      userName: user.name,
      action: 'DELETE',
      date: new Date().toISOString(),
      page: 'ANNOUNCEMENTS',
    })

    setAnnouncements(announcements.filter((a) => a.id !== id))
    toast.info('Announcement deleted', { theme: 'dark' })
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

    await axios.post('http://localhost:5000/logs', {
      userName: user.name,
      action: 'UPDATE',
      date: new Date().toISOString(),
      page: 'ANNOUNCEMENTS',
    })
  }

  const handleSelectDate = (day) => {
    setDate(`Jan ${day}, 2026`)
    setCalendarOpen(false)
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgElevated: '#1e293b',
          colorText: '#f8fafc',
          borderRadius: 12,
          colorPrimary: '#06b6d4',
          fontFamily: 'inherit',
        },
        components: {
          Modal: {
            contentBg: '#0f172a',
            headerBg: '#0f172a',
          },
        },
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a1122] to-slate-950 px-6 py-12 text-slate-100 font-sans selection:bg-cyan-500/30">
        <ToastContainer position="top-right" autoClose={2000} />

        {/* HEADER */}
        <div className="max-w-[1400px] mx-auto mb-10 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <HiMegaphone className="text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Announcements
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Create and manage system-wide updates
            </p>
          </div>
        </div>

        {/* ADD CARD SECTION */}
        <div className="max-w-[1400px] mx-auto mb-14">
          <div className="relative rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/5 p-1 shadow-2xl shadow-black/40 overflow-visible group">
            {/* Glow Effect behind borders */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition duration-700 -z-10"></div>

            <div className="bg-[#0b1221]/90 rounded-[22px] p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                {/* Title Input */}
                <div className="lg:col-span-3 relative group/input">
                  <HiOutlineHashtag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter title..."
                    className="w-full h-14 pl-11 pr-4 rounded-xl bg-slate-950/50 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                  />
                </div>

                {/* Text Input */}
                <div className="lg:col-span-5 relative group/input">
                  <HiOutlineChatBubbleLeftRight className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
                  <input
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="What's happening?"
                    className="w-full h-14 pl-11 pr-4 rounded-xl bg-slate-950/50 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                  />
                </div>

                {/* Date Picker */}
                <div className="bg-cyan-500/20 lg:col-span-2 relative z-50">
                  {/* Dropdown Calendar */}

                  <DatePicker
                    className="w-full h-14 pl-11 pr-4 rounded-xl bg-slate-950/50 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                    value={editDeadline ? dayjs(editDeadline) : null}
                    onChange={(d, ds) => setEditDeadline(ds)}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={addAnnouncement}
                  className="lg:col-span-2 h-14 rounded-xl bg-gradient-to-r bg-cyan-600 hover: text-white font-bold text-sm tracking-wide flex justify-center items-center gap-2 shadow-lg shadow-cyan-900/40 transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                >
                  <HiPlus className="text-lg" />
                  PUBLISH
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* GRID SECTION */}
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="group relative bg-slate-900/40 backdrop-blur-md rounded-[24px] border border-white/5 p-1 transition-all duration-300 hover:bg-slate-900/60 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
            >
              <div className="h-full bg-[#111827]/80 rounded-[20px] p-6 flex flex-col border border-white/0 group-hover:border-cyan-500/20 transition-colors">
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 border border-white/5 shadow-inner">
                    <HiMegaphone />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {a.date}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {a.title}
                </h3>
                <p className="text-slate-400 mt-3 text-sm leading-relaxed flex-grow line-clamp-3">
                  {a.text}
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
                  <button
                    className="p-2 rounded-lg text-slate-400 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all duration-200"
                    onClick={() => openEditModal(a)}
                    title="Edit"
                  >
                    <HiOutlinePencilSquare className="text-lg" />
                  </button>
                  <button
                    className="p-2 rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
                    onClick={() => deleteAnnouncement(a.id)}
                    title="Delete"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EDIT MODAL */}
        <Modal
          open={isModalOpen}
          onOk={updateAnnouncement}
          onCancel={() => setIsModalOpen(false)}
          centered
          closeIcon={<HiXMark className="text-slate-400 hover:text-white" />}
          okText="Save Changes"
          cancelText="Cancel"
          width={500}
          className="custom-modal"
        >
          <div className="pt-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <HiOutlinePencilSquare className="text-cyan-500" />
              Edit Announcement
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-medium ml-1">
                  Title
                </label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all placeholder-slate-600"
                  placeholder="Title..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-medium ml-1">
                  Description
                </label>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-none placeholder-slate-600"
                  placeholder="Details..."
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  )
}

export default Announcements
