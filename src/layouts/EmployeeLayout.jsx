import React, { useState } from 'react'
import EmployeeSidebar from '../components/EmployeeSidebar'
import EmployeeTopBar from '../components/EmployeeTopbar'
import { Outlet } from 'react-router-dom'
function MainLayOut() {
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

        <EmployeeSidebar isCollapsed={isCollapsed} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <EmployeeTopBar onToggle={toggleSidebar} />
        <main
          className="
            flex-1 overflow-y-auto
            [&::-webkit-scrollbar]:hidden
            [-ms-overflow-style:none]
            [scrollbar-width:none]
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayOut
