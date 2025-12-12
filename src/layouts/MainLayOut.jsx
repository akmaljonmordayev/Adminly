import React from "react";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
function MainLayOut({ children }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Sidebar />
      </div>
      <div>
        <TopBar />
        {children}
      </div>
    </div>
  );
}

export default MainLayOut;
