import React from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'

function MainLayOut({ children }) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div
        className="
    w-70
    overflow-y-auto
    [&::-webkit-scrollbar]:hidden
    [-ms-overflow-style:none]
    [scrollbar-width:none]
  "
      >
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main
          className="
        flex-1 overflow-y-auto
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]
      "
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayOut
