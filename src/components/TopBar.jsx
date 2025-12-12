import React from "react";
import { FaBars } from "react-icons/fa6";
import { FaSearch, FaPowerOff } from "react-icons/fa";
import { CgMail } from "react-icons/cg";
import { CiBellOn } from "react-icons/ci";
import { AiOutlineBars } from "react-icons/ai";

function TopBar({ image, name, username }) {
  return (
    <div className="w-full h-16 bg-white shadow-md flex items-center px-4 gap-4">
      <FaBars className="text-purple-600 text-2xl cursor-pointer" />

      <div className="flex items-center bg-purple-50 border border-purple-200 rounded-xl px-3 py-1 w-72">
        <input
          required
          placeholder="Search projects"
          type="text"
          className="bg-transparent outline-none text-purple-900 w-full"
        />
        <FaSearch className="text-purple-500" />
      </div>

      <div className="flex items-center ml-auto gap-3">
        <img
          src={image}
          alt=""
          className="w-10 h-10 rounded-full border-2 border-purple-400"
        />
        <h2 className="font-semibold text-purple-700">
          {name} <span className="text-purple-500">{username}</span>
        </h2>
      </div>

      <div className="flex items-center gap-5 ml-6 text-purple-600 text-xl cursor-pointer">
        <CgMail />
        <CiBellOn />
        <FaPowerOff />
        <AiOutlineBars />
      </div>
    </div>
  );
}

export default TopBar;

