import React, { useState } from "react";
import { Button, Modal } from "antd";
import axios from "axios";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);
  const [saveSession, setSaveSession] = useState(true);
  const [devMode, setDevMode] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [userFullname, setUserFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [newFullname, setNewFullname] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!user) return null;
  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    let user = JSON.parse(localStorage.getItem("user"));
    setUserFullname(user.name);
    setPassword(user.password);
    setEmail(user.email);
  };

  const submitData = async (e) => {
    e.preventDefault();
    let user = JSON.parse(localStorage.getItem("user"));
    try {
      let res = await axios.put(`http://localhost:5000/users/${user.id}`, {
        id: user.id,
        name: newFullname,
        email: newEmail,
        password: newPassword,
        role: "manager",
      });
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071B2D] to-[#0C2B3E] flex justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1200px]">
        {/* Profile Section */}
        <div className="bg-[#0D3146] flex-1 rounded-2xl p-8 flex flex-col shadow-lg">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D1FF] to-[#00A7CC] flex items-center justify-center text-[#071B2D] text-3xl">
              👤
            </div>
            <div>
              <div className="text-[#EAFBFF] font-semibold text-2xl sm:text-3xl">
                {user.name}
              </div>
              <div className="text-[#7FCFE3] text-lg sm:text-xl">
                {user.role}
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 mt-4">
            <Row label="Email" value={user.email} />
            <Row label="Password" value={user.password} />
            <Row label="Role" value={user.role} highlight />
          </div>

          <button
            onClick={showLoading}
            className="w-full py-3 mt-auto rounded-xl
            bg-gradient-to-r from-[#00D1FF] to-[#00A7CC] text-[#071B2D] text-lg sm:text-xl font-semibold
            hover:brightness-110 transition"
          >
            Change profile
          </button>
        </div>

        {/* Settings Section */}
        <div className="bg-[#0D3146] flex-1 rounded-2xl p-6 sm:p-8 flex flex-col justify-center gap-4 sm:gap-6 shadow-lg">
          <Setting
            title="Notifications"
            checked={notifications}
            onClick={() => setNotifications(!notifications)}
          />
          <Setting
            title="Email Alerts"
            checked={emailAlerts}
            onClick={() => setEmailAlerts(!emailAlerts)}
          />
          <Setting
            title="Two-Factor Auth"
            checked={twoFA}
            onClick={() => setTwoFA(!twoFA)}
          />
          <Setting
            title="Private Profile"
            checked={privateMode}
            onClick={() => setPrivateMode(!privateMode)}
          />
          <Setting
            title="Auto Logout"
            checked={autoLogout}
            onClick={() => setAutoLogout(!autoLogout)}
          />
          <Setting
            title="Save Session"
            checked={saveSession}
            onClick={() => setSaveSession(!saveSession)}
          />
          <Setting
            title="Developer Mode"
            checked={devMode}
            onClick={() => setDevMode(!devMode)}
          />
        </div>
      </div>
      <Modal
        title={<p className="text-lg font-semibold">Loading Modal</p>}
        footer={
          <Button
            type="primary"
            onClick={showLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
          >
            Reload
          </Button>
        }
        loading={loading}
        open={open}
        onCancel={() => setOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <form onSubmit={(e) => submitData(e)} action="">
            <input
              onChange={(e) => setNewFullname(e.target.value)}
              value={userFullname}
              placeholder="Full Name"
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              onChange={(e) => setNewEmail(e.target.value)}
              value={email}
              placeholder="Your Email"
              type="email"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={password}
              placeholder="Your Password"
              type="password"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit">Edit Profile</button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#7FCFE3] text-base sm:text-lg font-medium">
        {label}
      </span>
      <span
        className={`text-base sm:text-xl font-medium ${
          highlight ? "text-[#00D1FF]" : "text-[#EAFBFF]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Setting({ title, checked, onClick }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#EAFBFF] text-base sm:text-xl font-medium">
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
      className={`w-14 sm:w-16 h-7 sm:h-8 rounded-full flex items-center px-1 cursor-pointer transition-all
      ${
        checked
          ? "bg-gradient-to-r from-[#00D1FF] to-[#00A7CC]"
          : "bg-[#123B52]"
      }`}
    >
      <div
        className={`w-6 h-6 sm:w-6 sm:h-6 rounded-full bg-white transition-transform transform
        ${checked ? "translate-x-6 sm:translate-x-7" : "translate-x-0"}`}
      />
    </div>
  );
}

export default Settings;
