import React, { useEffect, useState } from 'react'
import axios from 'axios'
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

  let user = JSON.parse(localStorage.getItem('user'))

  const addAnnouncement = async () => {
    if (!newTitle || !newText) {
      toast.error('Please fill in all fields', { theme: 'dark' })
      return
    }

    const newAnn = {
      title: newTitle,
      text: newText,
      date: date || new Date().toISOString(),
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

      // ✅ LOGS POST
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
    toast.error('Announcment successfully deleted and achieved', {
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
          colorBgElevated: '#0f172a',
          colorText: '#f8fafc',
          borderRadius: 16,
          colorPrimary: '#06b6d4',
        },
      }}
    >
      <div className="min-h-screen bg-[#020617] px-6 py-12 text-slate-100">
        <ToastContainer position="top-right" autoClose={2000} />

        <div className="max-w-[1400px] mx-auto mb-10">
          <h1 className="text-3xl font-bold text-white">Announcements</h1>
        </div>

        {/* ADD CARD */}
        <div className="max-w-[1400px] mx-auto mb-12 rounded-[2rem] bg-white/[0.02] border border-white/5 p-8 overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center overflow-visible">
            <div className="lg:col-span-3 relative">
              <HiOutlineHashtag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title..."
                className="w-full h-14 pl-11 rounded-2xl bg-slate-900 border border-white/10 text-white"
              />
            </div>

            <div className="lg:col-span-5 relative">
              <HiOutlineChatBubbleLeftRight className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Description..."
                className="w-full h-14 pl-11 rounded-2xl bg-slate-900 border border-white/10 text-white"
              />
            </div>

            {/* DATE PICKER FIXED */}
            <div className="lg:col-span-2 relative overflow-visible z-[999]">
              <button
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="w-full h-14 rounded-xl bg-[#020617]
             border border-slate-700 px-4
             flex items-center justify-between
             text-sm text-slate-200
             hover:border-cyan-500 hover:bg-slate-900
             transition-all duration-200"
              >
                <span className={date ? 'text-slate-100' : 'text-slate-500'}>
                  {date || 'Select date'}
                </span>
                <HiOutlineCalendarDays className="text-lg text-cyan-400" />
              </button>

              {calendarOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-72
               bg-[#020617]
               border border-slate-700
               rounded-xl
               p-4
               shadow-xl
               z-[9999]"
                >
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(31)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectDate(i + 1)}
                        className="h-8 w-8 rounded-lg
                     text-xs font-medium
                     text-slate-300
                     hover:bg-cyan-500 hover:text-black
                     transition-colors"
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={addAnnouncement}
              className="lg:col-span-2 h-14 rounded-2xl bg-cyan-600 text-white font-bold flex justify-center items-center gap-2"
            >
              <HiPlus />
              Publish
            </button>
          </div>
        </div>


        {/* GRID */}
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="bg-slate-900/40 rounded-[2rem] border border-white/5 p-7 flex flex-col"
            >
              <h3 className="text-xl font-bold text-white">{a.title}</h3>
              <p className="text-slate-400 mt-4 flex-grow">{a.text}</p>

              <div className="flex justify-between items-center mt-6">
                <span className="text-xs text-slate-500">{a.date}</span>
                <div className="flex gap-2">
                  <button
                    className="transition-all hover:scale-125 cursor-pointer"
                    onClick={() => openEditModal(a)}
                  >
                    <HiOutlinePencilSquare />
                  </button>
                  <button
                    className="transition-all hover:scale-125 cursor-pointer"
                    onClick={() => deleteAnnouncement(a.id)}
                  >
                    <HiOutlineTrash />
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
          closeIcon={<HiXMark />}
          okText="Save Changes"
        >
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full mb-4 p-3 bg-slate-900 border-2 border-cyan-500 rounded-[15px] text-white"
          />
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="w-full mb-4 p-3 bg-slate-900 border-2 border-cyan-500 rounded-[15px] text-white"
          />
        </Modal>
      </div>
    </ConfigProvider>
  )
}

export default Announcements
