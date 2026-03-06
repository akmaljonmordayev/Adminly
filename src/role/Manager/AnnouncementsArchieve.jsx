import { useTheme } from '../../context/ThemeContext';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import {
  HiOutlineClipboardList,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineStatusOnline,
  HiOutlineRefresh,
  HiOutlineTrash,
  HiOutlineSpeakerphone,
  HiOutlineInformationCircle
} from 'react-icons/hi'
import { FiAlertCircle, FiClock, FiFileText } from 'react-icons/fi'

function AnnouncementsArchieve() {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const getData = async () => {
    setLoading(true)
    try {
      let res = await axios.get('http://localhost:5000/announcementsDeleted')
      setData(res.data)
    } catch (error) {
      toast.error('Failed to load archive')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const deleteAnnouncements = async (id) => {
    if (!window.confirm('Delete permanently?')) return
    try {
      await axios.delete(`http://localhost:5000/announcementsDeleted/${id}`)
      toast.error('Announcement deleted permanently')
      getData()
    } catch {
      toast.error('Delete failed')
    }
  }

  const restoreAnnouncements = async (announcement) => {
    try {
      await axios.delete(`http://localhost:5000/announcementsDeleted/${announcement.id}`)
      await axios.post('http://localhost:5000/announcements', {
        ...announcement,
        id: crypto.randomUUID(),
      })
      toast.success('Announcement successfully restored')
      getData()
    } catch {
      toast.error('Restore failed')
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-2 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/60 animate-pulse">Syncing Feed History...</p>
    </div>
  )

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight uppercase">Announcements <span className="text-amber-400 italic">History</span></h2>
          <p className="text-[var(--text-secondary)] text-xs font-medium mt-1">Found {data.length} archived broadcasts</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-500/5">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 font-black text-xs uppercase tracking-widest">{data.length} Archived</span>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
          <div className="w-20 h-20 mx-auto mb-6 rounded-[2rem] bg-amber-500/5 flex items-center justify-center text-amber-400/30 border border-amber-500/10">
            <HiOutlineSpeakerphone size={48} />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Archive is Empty</h3>
          <p className="text-[var(--text-secondary)] text-xs mt-2 uppercase tracking-widest font-black opacity-40">No deleted announcements found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, i) => (
            <div
              key={item.id}
              className="group relative glass-strong rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-amber-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 animate-fadeInScale"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-br from-amber-600/10 to-transparent group-hover:from-amber-600/20 transition-all duration-500" />

              <div className="p-7 relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                    <HiOutlineSpeakerphone size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => restoreAnnouncements(item)}
                      className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                    >
                      <HiOutlineRefresh size={20} />
                    </button>
                    <button
                      onClick={() => deleteAnnouncements(item.id)}
                      className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mb-6 flex-1">
                  <h3 className="text-lg font-black text-[var(--text-primary)] group-hover:text-amber-400 transition-colors uppercase leading-tight line-clamp-2">{item.title}</h3>
                  <div className="bg-white/5 p-4 rounded-3xl border border-white/5 h-[100px] overflow-hidden group-hover:h-auto group-hover:max-h-[200px] transition-all duration-500">
                    <p className="text-[10px] text-[var(--text-secondary)] font-medium leading-relaxed italic opacity-80">{item.text}</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiClock className="text-amber-500" />
                    <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-[var(--text-secondary)] border-white/10'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer
        theme={isDarkMode ? 'dark' : 'light'}
        position="bottom-right"
        autoClose={2500}
        toastClassName="!rounded-2xl !bg-[var(--bg-secondary)] !border !border-white/5 !shadow-2xl"
      />
    </div>
  )
}

export default AnnouncementsArchieve
