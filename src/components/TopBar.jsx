import React from "react";
import { FaBars } from "react-icons/fa6";
import { FaSearch, FaPowerOff } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaBell } from "react-icons/fa";





function TopBar({ image, name, username }) {
  return (
    <div className="bg-[#0b1220] w-full h-16 flex items-center px-6 gap-4
    from-[#020617] via-[#020b1c] to-[#031c2e]
      border-b border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]">

      <FaBars className="text-cyan-400 text-2xl cursor-pointer hover:text-cyan-300" />

      <div className="flex items-center bg-[#020617] border border-cyan-400/30
        rounded-xl px-4 py-1 w-72 shadow-inner">
        <input
          placeholder="Search projects"
          type="text"
          className="bg-transparent outline-none text-cyan-100 w-full placeholder:text-cyan-500"
        />
        <FaSearch className="text-cyan-400" />
      </div>

      <div className="flex items-center ml-auto gap-3">
        <FaUserCircle className="text-cyan-300 text-[30px]" />
        <h2 className="font-semibold text-cyan-200">
          {name} <span className="text-cyan-400">{username}</span>
        </h2>
      </div>

      <div className="flex items-center gap-5 ml-6 text-cyan-400 text-xl cursor-pointer">
        <MdOutlineMailOutline className=" text-[25px] hover:text-red-600" />
        <IoLogOutOutline className=" text-[25px] hover:text-red-600" />
        <FaBell className=" text-[25px] hover:text-red-600" />
      </div>
    </div>
  );
}

export default TopBar;
