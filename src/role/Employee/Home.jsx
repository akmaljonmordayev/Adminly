import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Card from "../../components/Card";
import {
  FaUsers,
  FaTasks,
  FaBullhorn,
  FaExclamationCircle,
  FaArchive,
  FaSignOutAlt,
  FaHistory,
} from "react-icons/fa";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [complaints, setComplaints] = useState([]);

  let user = JSON.parse(localStorage.getItem("user"));
  const Tasks = async () => {
    let res = await axios.get("http://localhost:5000/tasks");
    let allData = res.data;
    console.log(allData);
    let filterData = allData?.filter(
      (item) => item.employeeName == user.fullName,
    );
    console.log(filterData);

    setTasks(filterData);
  };

  const Announcements = async () => {
    let res = await axios.get("http://localhost:5000/announcements");
    let allData = res.data;
    setAnnouncements(allData);
  };

  const Complaints = async () => {
    let res = await axios.get("http://localhost:5000/complaints");
    let allData = res.data;
    console.log(allData);
    let filterData = allData?.filter(
      (item) => item.employeeName == user.fullName,
    );
    setComplaints(filterData);
  };

  useEffect(() => {
    Tasks();
    Announcements();
    Complaints();
  }, []);

  return (
    <div className="flex p-[50px_0px_0px_0px] items-center justify-center gap-30">
      <Card
        title={"TASKS"}
        value={tasks?.length ? tasks?.length : 0}
        icon={<FaTasks />}
        color={"red"}
      />
      <Card
        title={"ANNOUNCEMENTS"}
        value={announcements?.length ? announcements?.length : 0}
        icon={<FaBullhorn />}
        color={"blue"}
      />
      <Card
        title={"COMPLAINTS"}
        value={complaints?.length ? complaints?.length : 0}
        icon={<FaExclamationCircle />}
        color={"yellow"}
      />
    </div>
  );
}

export default Home;
