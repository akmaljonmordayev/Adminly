import React from "react";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";

function MainLayOut({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayOut;
