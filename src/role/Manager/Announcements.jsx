import React, { useEffect, useState } from 'react'
import { Modal, ConfigProvider, theme } from 'antd'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  HiOutlineCalendarDays,
  HiOutlineTrash,
  HiOutlinePencilSquare,
  HiXMark,
  HiOutlineHashtag,
  HiOutlineChatBubbleLeftRight,
  HiPlus,
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

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch(console.error)
  }, [])

  const addAnnouncement = async () => {
    if (!newTitle || !newText) {
      toast.error('Please fill in all fields', { theme: 'dark' })
      return
    }

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
    toast.success('Announcement published successfully', { theme: 'dark' })
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
    toast.success('Changes saved successfully', { theme: 'dark' })
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
          colorBgElevated: '#0f172a',
          colorText: '#f8fafc',
          borderRadius: 16,
          colorPrimary: '#06b6d4',
        },
      }}
    >
      <div className="min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#020617] to-[#020617] px-6 py-12 text-slate-100 font-sans">
        <ToastContainer position="top-right" autoClose={2000} />

        {/* Header Section */}
        <div className="max-w-[1400px] mx-auto mb-10 flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Announcements
            </h1>
          </div>
        </div>

        {/* Add Announcement Card */}
        <div className="max-w-[1400px] mx-auto mb-12 rounded-[2rem] bg-white/[0.02] border border-white/5 p-8 shadow-2xl backdrop-blur-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Input Title */}
            <div className="lg:col-span-3 relative group">
              <HiOutlineHashtag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                placeholder="Title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full h-14 pl-11 pr-4 rounded-2xl bg-slate-900/50 border border-white/10 text-sm outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-white placeholder:text-slate-500"
              />
            </div>

            {/* Input Description */}
            <div className="lg:col-span-5 relative group">
              <HiOutlineChatBubbleLeftRight className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                placeholder="Detailed description..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full h-14 pl-11 pr-4 rounded-2xl bg-slate-900/50 border border-white/10 text-sm outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-white placeholder:text-slate-500"
              />
            </div>

            {/* Date Picker Button */}
            <div className="lg:col-span-2 relative">
              <button
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="w-full h-14 rounded-2xl bg-slate-900/50 border border-white/10 px-4 flex items-center justify-between text-sm hover:border-cyan-500/50 transition-all group"
              >
                <span className={date ? 'text-slate-100' : 'text-slate-500'}>
                  {date || 'Select Date'}
                </span>
                <HiOutlineCalendarDays className="text-xl text-cyan-500 group-hover:scale-110 transition-transform" />
              </button>

              {calendarOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 bg-[#0f172a] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
                  <div className="grid grid-cols-7 gap-1">
                    {[...Array(31)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectDate(i + 1)}
                        className="h-9 w-9 rounded-lg text-xs font-medium hover:bg-cyan-600 transition-colors"
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Publish Button */}
            <button
              onClick={addAnnouncement}
              className="lg:col-span-2 h-14 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 active:scale-95 transition-all uppercase"
            >
              <HiPlus className="text-xl" />
              Publish
            </button>
          </div>
        </div>

        {/* Announcements Grid */}
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="group relative bg-slate-900/40 rounded-[2rem] border border-white/5 p-7 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-900/20 flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {a.title}
                  </h3>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter uppercase border ${
                    a.status === 'Active'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                      : 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                  }`}
                >
                  {a.status}
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                {a.text}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-slate-500">
                  <HiOutlineCalendarDays className="text-lg" />
                  <span className="text-xs font-medium">{a.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(a)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-400 transition-all"
                  >
                    <HiOutlinePencilSquare size={18} />
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(a.id)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-all"
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-white text-xs font-black tracking-widest uppercase">
                Edit Announcement
              </span>
            </div>
          }
          open={isModalOpen}
          onOk={updateAnnouncement}
          onCancel={() => setIsModalOpen(false)}
          centered
          width={450}
          closeIcon={
            <HiXMark className="text-slate-400 hover:rotate-90 transition-transform" />
          }
          styles={{
            content: {
              backgroundColor: '#0f172a',
              borderRadius: '32px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)',
            },
            header: { backgroundColor: 'transparent', border: 'none' },
            mask: {
              backdropFilter: 'blur(12px)',
              backgroundColor: 'rgba(0,0,0,0.7)',
            },
          }}
          okText="Save Changes"
          okButtonProps={{
            className:
              'bg-cyan-600 hover:bg-cyan-500 border-none rounded-xl h-11 px-8 font-bold',
          }}
          cancelButtonProps={{ className: 'hidden' }}
        >
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-2 italic">
                Title
              </label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-cyan-500 transition-all text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-2 italic">
                Description
              </label>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-cyan-500 min-h-[120px] resize-none transition-all text-white"
              />
            </div>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  )
}

export default Announcements
