import React, { useState } from "react";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);
  const [saveSession, setSaveSession] = useState(true);
  const [devMode, setDevMode] = useState(false);

  if (!user) return null;

  return (
    <div className="w-full h-screen bg-[#071B2D] flex items-center gap-12 px-12">

      <div
        className="bg-[#0C2B3E] rounded-2xl px-7 py-6 w-[360px] h-[460px]
        shadow-[0_0_35px_rgba(0,209,255,0.25)]"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-[#00D1FF] flex items-center justify-center text-[#071B2D] text-xl">
            👤
          </div>

          <div>
            <div className="text-[#EAFBFF] font-semibold leading-5">
              {user.name}
            </div>
            <div className="text-[#7FCFE3] text-sm">{user.role}</div>
          </div>
        </div>

        <div className="space-y-4 text-sm mt-20">
          <Row label="Email" value={user.email} />
          <Row label="Password" value={user.password} />
          <Row label="Role" value={user.role} highlight />
        </div>

        <button
          className="w-full py-2 mt-12 rounded-xl
          bg-[#00D1FF] text-[#071B2D] font-semibold
          hover:brightness-110 transition"
        >
          Change profile
        </button>
      </div>

      <div 
        className="bg-[#0C2B3E] rounded-2xl p-7 h-[460px] w-[360px]
        shadow-[0_0_35px_rgba(0,209,255,0.25)] space-y-5"
      >
        <Setting title="Notifications" checked={notifications} onClick={() => setNotifications(!notifications)} />
        <Setting title="Email Alerts" checked={emailAlerts} onClick={() => setEmailAlerts(!emailAlerts)} />
        <Setting title="Two-Factor Auth" checked={twoFA} onClick={() => setTwoFA(!twoFA)} />
        <Setting title="Private Profile" checked={privateMode} onClick={() => setPrivateMode(!privateMode)} />
        <Setting title="Auto Logout" checked={autoLogout} onClick={() => setAutoLogout(!autoLogout)} />
        <Setting title="Save Session" checked={saveSession} onClick={() => setSaveSession(!saveSession)} />
        <Setting title="Developer Mode" checked={devMode} onClick={() => setDevMode(!devMode)} />
      </div>
    </div>
  );
}


function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between text-[#7FCFE3]">
      <span>{label}</span>
      <span className={highlight ? "text-[#00D1FF]" : "text-[#EAFBFF]"}>
        {value}
      </span>
    </div>
  );
}

function Setting({ title, checked, onClick }) {
  return (
    <div className="flex justify-between items-center text-[#EAFBFF]">
      <span>{title}</span>
      <Switch checked={checked} onClick={onClick} />
    </div>
  );
}

function Switch({ checked, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-14 h-7 rounded-full flex items-center px-1 cursor-pointer transition
      ${checked ? "bg-[#00D1FF]" : "bg-[#123B52]"}`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white transition transform
        ${checked ? "translate-x-7" : "translate-x-0"}`}
      />
    </div>
  );
}

export default Settings;
