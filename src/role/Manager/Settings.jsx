import React from "react";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return null;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-[#07182E] rounded-xl px-7 py-6 w-[360px]
        shadow-[0_0_25px_rgba(34,211,238,0.18)]">

        {/* top */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-[#22D3EE] flex items-center justify-center">
            <svg
              className="w-7 h-7 text-[#04131f]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
            </svg>
          </div>

          <div>
            <div className="text-white text-base font-semibold">
              {user.name}
            </div>
            <div className="text-[#22D3EE] text-sm">
              {user.role}
            </div>
          </div>
        </div>

        {/* details */}
        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between text-gray-300">
            <span>ID</span>
            <span className="text-white">{user.id}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Email</span>
            <span className="text-white">{user.email}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Password</span>
            <span className="text-white">{user.password}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Role</span>
            <span className="text-[#22D3EE]">{user.role}</span>
          </div>
        </div>

        {/* change profile button */}
        <button
          className="w-full py-2 rounded-lg
          bg-[#22D3EE] text-[#04131f] font-semibold
          hover:bg-[#38e1f5] transition"
        >
          Change profile
        </button>

      </div>
    </div>
  );
}

export default Settings;
