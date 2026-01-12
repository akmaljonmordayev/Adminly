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
    <div className="w-full min-h-screen bg-[#071B2D] flex justify-between">
      <div className="flex gap-12 w-full max-w-[1100px]">

        <div className="bg-[#0C2B3E] w-[450px] h-[650px] p-8 flex flex-col">
          
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 rounded-full bg-[#00D1FF] flex items-center justify-center text-[#071B2D] text-3xl">
              👤
            </div>

            <div>
              <div className="text-[#EAFBFF] font-semibold text-3xl">
                {user.name}
              </div>
              <div className="text-[#7FCFE3] text-xl">
                {user.role}
              </div>
            </div>
          </div>

          <div className="space-y-6 mt-6">
            <Row label="Email" value={user.email} />
            <Row label="Password" value={user.password} />
            <Row label="Role" value={user.role} highlight />
          </div>

          <button
            className="w-full py-3 mt-auto rounded-xl
            bg-[#00D1FF] text-[#071B2D] text-xl font-semibold
            hover:brightness-110 transition"
          >
            Change profile
          </button>
        </div>

        <div className="bg-[#0C2B3E] m-[20px] p-8 h-[600px] w-[550px] flex flex-col justify-center gap-6">
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
      <span className="text-[#7FCFE3] text-lg font-medium">
        {label}
      </span>
      <span className={`text-xl font-medium ${highlight ? "text-[#00D1FF]" : "text-[#EAFBFF]"}`}>
        {value}
      </span>
    </div>
  );
}

function Setting({ title, checked, onClick }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#EAFBFF] text-xl font-medium">
        {title}
      </span>
      <Switch checked={checked} onClick={onClick} />
    </div>
  );
}

function Switch({ checked, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-16 h-8 rounded-full flex items-center px-1 cursor-pointer transition
      ${checked ? "bg-[#00D1FF]" : "bg-[#123B52]"}`}
    >
      <div
        className={`w-6 h-6 rounded-full bg-white transition transform
        ${checked ? "translate-x-8" : "translate-x-0"}`}
      />
    </div>
  );
}

export default Settings;
