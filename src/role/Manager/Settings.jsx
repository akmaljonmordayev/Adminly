import React from "react";

function Settings() {
  let user = JSON.parse(localStorage.getItem("user"));

  console.log(user);

  return <div>Settings</div>;
}

export default Settings;
