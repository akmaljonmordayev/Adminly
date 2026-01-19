import React, { useState } from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'

function MainLayOut({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden">
      <div
        className={`
          ${isCollapsed ? 'w-20' : 'w-[280px]'} 
          transition-all duration-300 ease-in-out
          overflow-y-auto
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]
        `}
      >
       
        <Sidebar isCollapsed={isCollapsed} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onToggle={toggleSidebar} />
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
