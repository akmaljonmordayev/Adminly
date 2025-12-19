import { useState } from "react";
import React from "react";
import {
  MdDashboard,
  MdApps,
  MdWidgets,
  MdViewSidebar,
  MdSettings,
  MdCropSquare,
  MdNotifications,
  MdOutlineCategory,
  MdFormatListBulleted,
  MdEdit,
  MdCode,
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "./Logo";

function Sidebar() {
  const [active, setActive] = useState("dashboard");

  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <MdDashboard />, link: "/" },
    { id: "pagelayouts", label: "Page Layouts", icon: <MdApps /> },
    { id: "apps", label: "Apps", icon: <MdWidgets /> },
  ];

  let user = JSON.parse(localStorage.getItem("user"));

  return (
    <aside className="w-[260px] bg-white p-4 flex flex-col rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-violet-600 flex items-center gap-2">
        <MdDashboard />
        Adminly
      </h1>

      <div className="flex items-center gap-3 mt-4">
        <FaUserCircle className="text-4xl text-purple-500" />
        <div>
          <p className="font-semibold text-gray-700">{user.name}</p>
          <p className="text-sm text-gray-400">{user.role}</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 mt-6">
        {menu.map((item) => {
          const content = (
            <div
              onClick={() => setActive(item.id)}
              className={`px-3 py-2 flex items-center gap-3 rounded-lg cursor-pointer transition
                ${
                  active === item.id
                    ? "bg-violet-600/15 text-violet-600 font-semibold"
                    : "text-gray-600 hover:bg-violet-600/10 hover:text-violet-600"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );

          return item.link ? (
            <Link key={item.id} to={item.link}>
              {content}
            </Link>
          ) : (
            <div key={item.id}>{content}</div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
