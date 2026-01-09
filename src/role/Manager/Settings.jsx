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
    <div className="w-full h-full bg-[#071B2D] flex justify-center ">
      
      {/* KATTA KONTEYNER */}
      <div className="flex gap-20 w-full max-w-[1400px]">

        {/* PROFIL CARD */}
        <div className="bg-[#0C2B3E] w-[450px] h-[677px]  p-10 flex flex-col">
          
          {/* Avatar */}
          <div className="flex items-center gap-6 mb-14">
            <div className="w-20 h-20 rounded-full bg-[#00D1FF] flex items-center justify-center text-[#071B2D] text-3xl">
              👤
            </div>

            <div>
              <div className="text-[#EAFBFF] font-semibold text-2xl">
                {user.name}
              </div>
              <div className="text-[#7FCFE3] text-lg">
                {user.role}
              </div>
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-8 mt-10">
            <Row label="Email" value={user.email} />
            <Row label="Password" value={user.password} />
            <Row label="Role" value={user.role} highlight />
          </div>

          {/* BUTTON */}
          <button
            className="w-full py-4 mt-auto rounded-2xl
            bg-[#00D1FF] text-[#071B2D] text-xl font-semibold
            hover:brightness-110 transition"
          >
            Change profile
          </button>
        </div>

        {/* SETTINGS CARD */}
        <div className="bg-[#0C2B3E] p-10 h-[630px] mt-[25px] w-[600px] flex flex-col justify-center gap-8">
          <Setting title="Notifications" checked={notifications} onClick={() => setNotifications(!notifications)} />
          <Setting title="Email Alerts" checked={emailAlerts} onClick={() => setEmailAlerts(!emailAlerts)} />
          <Setting title="Two-Factor Auth" checked={twoFA} onClick={() => setTwoFA(!twoFA)} />
          <Setting title="Private Profile" checked={privateMode} onClick={() => setPrivateMode(!privateMode)} />
          <Setting title="Auto Logout" checked={autoLogout} onClick={() => setAutoLogout(!autoLogout)} />
          <Setting title="Save Session" checked={saveSession} onClick={() => setSaveSession(!saveSession)} />
          <Setting title="Developer Mode" checked={devMode} onClick={() => setDevMode(!devMode)} />
        </div>

      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#7FCFE3] text-lg">{label}</span>
      <span className={`text-xl ${highlight ? "text-[#00D1FF]" : "text-[#EAFBFF]"}`}>
        {value}
      </span>
    </div>
  );
}

function Setting({ title, checked, onClick }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#EAFBFF] text-xl">{title}</span>
      <Switch checked={checked} onClick={onClick} />
    </div>
  );
}

function Switch({ checked, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-20 h-10 rounded-full flex items-center px-1 cursor-pointer transition
      ${checked ? "bg-[#00D1FF]" : "bg-[#123B52]"}`}
    >
      <div
        className={`w-8 h-8 rounded-full bg-white transition transform
        ${checked ? "translate-x-10" : "translate-x-0"}`}
      />
    </div>
  );
}

export default Settings;
