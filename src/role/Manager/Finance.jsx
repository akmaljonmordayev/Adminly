import React, { useState } from 'react'

// const [view, setView] = useState(false)

const columns = ['Name', 'Age', 'Address', 'Action']

const dataSource = Array.from({ length: 75 }).map((_, i) => ({
  key: i,
  name: `Employee ${i + 1}`,
  age: Math.floor(Math.random() * (60 - 25 + 1)) + 25,
  address: `Toshkent. Yunusabot Uy №${
    Math.floor(Math.random() * (60 - 25 + 1)) + 25
  }`,
}))

const ITEMS_PER_PAGE = 15

function Finance() {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(dataSource.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentData = dataSource.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="p-6 bg-[#0b1220] min-h-screen text-gray-300">
      <div className="overflow-x-auto rounded-xl shadow-lg border border-white/5">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-[#0e1627]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {currentData.map((row) => (
              <tr key={row.key} className="transition-all hover:bg-cyan-400/5">
                <td className="px-6 py-4">{row.name}</td>
                <td className="px-6 py-4">{row.age}</td>
                <td className="px-6 py-4">{row.address}</td>
                <td className="px-6 py-4">
                  {/* VIEW BUTTON */}
                  <button
                    // onClick={() => !view}
                    className="
                    cursor-pointer
                      px-4 py-2 text-sm font-semibold
                      text-cyan-400 bg-cyan-400/10
                      rounded-xl transition-all
                      hover:bg-cyan-400/20
                      hover:shadow-[0_0_12px_rgba(0,255,255,0.35)]
                    "
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* {setView ? } */}

        {/* PAGINATION */}
        <div className="flex justify-center gap-2 p-4 bg-[#0e1627]">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === page
                  ? 'bg-cyan-400/20 text-cyan-400'
                  : 'bg-white/5 text-gray-400 hover:bg-cyan-400/10'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Finance
