import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaUmbrellaBeach, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa'

function MyVacations() {
  const [vacations, setVacations] = useState([])
  const [selectedYear, setSelectedYear] = useState('2026')
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        setLoading(true)
        const res = await axios.get('http://localhost:5000/vacations')
        const currentUserName = user?.name || user?.fullName
        const myData = res.data.filter(v => v.employeeName === currentUserName)
        setVacations(myData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchVacations()
  }, [user?.fullName])

  const filtered = vacations.filter(v => v.startDate.startsWith(selectedYear))

  if (loading) return <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-emerald-400 font-bold animate-pulse tracking-widest">LOADING VACATION LOGS...</div>

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h1 className="text-4xl font-black text-[var(--text-primary)] italic tracking-tighter mb-4">
              MY <span className="text-emerald-400 uppercase">Vacations</span>
            </h1>
            <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-xs opacity-60">
              MANAGE YOUR TIME OFF AND HOLIDAYS
            </p>
          </div>

          <div className="flex items-center gap-3 bg-cyan-500/5 p-1 rounded-2xl border border-cyan-500/10">
            {['2025', '2026'].map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${selectedYear === y
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
              >
                {y} Year
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pb-20">
          {filtered.map((v) => (
            <div key={v.id} className="group relative bg-[var(--card-bg)] border border-cyan-500/10 p-8 rounded-[2.5rem] hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <FaUmbrellaBeach size={24} />
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${v.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-[var(--card-bg)]mber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                  {v.status}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mb-1">Duration Period</p>
                  <div className="flex items-center gap-3 text-[var(--text-primary)] font-bold tracking-tight">
                    <FaCalendarAlt className="text-emerald-500" /> {v.startDate} <span className="text-slate-600">→</span> {v.endDate}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center gap-2">
                  <FaClock className="text-slate-600" />
                  <p className="text-xs text-[var(--text-secondary)] font-medium">Requested on {v.startDate}</p>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-32 bg-[var(--card-bg)]/20 border border-dashed border-cyan-500/10 rounded-[3rem]">
              <p className="text-[var(--text-secondary)] font-bold uppercase tracking-[0.4em]">NO VACATION RECORDS ON FILE FOR {selectedYear}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyVacations
