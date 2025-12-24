import React, { useState } from "react";

const complaintsData = [
  { id: 1, title: "Internet ishlamayapti", desc: "Tez-tez uzilib qoladi" },
  { id: 2, title: "Elektr muammosi", desc: "Tok o‘chib qolmoqda" },
  { id: 3, title: "Suv bosimi past", desc: "Ertalab suv yo‘q" },
  { id: 4, title: "Yo‘l yomon holatda", desc: "Chuqurlar ko‘p" },
  { id: 5, title: "Gaz bosimi past", desc: "Ovqat pishmayapti" },
  { id: 6, title: "Axlat olib ketilmayapti", desc: "Bir haftadan beri" },
  { id: 7, title: "Lift ishlamayapti", desc: "5 kundan beri nosoz" },
  { id: 8, title: "Issiq suv yo‘q", desc: "Qozonxona o‘chgan" },
  { id: 9, title: "Sovuq xona", desc: "Isitish tizimi ishlamayapti" },
  { id: 10, title: "Chiroqlar o‘chiq", desc: "Ko‘chada qorong‘i" },
];

export default function ComplaintsAdmin() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("a-z");

  const filtered = complaintsData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) =>
    sort === "a-z"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );

  return (
    <div className="min-h-screen bg-[#0b1220]  text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0b1220]  border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-slate-300">
              Complaints management
            </p>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56 rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="a-z">A – Z</option>
              <option value="z-a">Z – A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sorted.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-5 transition hover:scale-[1.02] hover:bg-white/15"
            >
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-500 to-purple-500" />

              <div className="flex items-start justify-between mb-3">
                <h2 className="font-semibold text-lg">
                  {item.title}
                </h2>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  #{item.id}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {sorted.length === 0 && (
          <p className="text-center text-slate-400 mt-10">
            No complaints found
          </p>
        )}
      </div>
    </div>
  );
}
