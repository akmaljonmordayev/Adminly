import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import {
  FaUsers,
  FaTasks,
  FaBullhorn,
  FaExclamationCircle,
  FaArchive,
} from "react-icons/fa";
import axios from "axios";

function Dashboard() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [allArchieve1, setAllArchieve1] = useState([]);
  const [allArchieve2, setAllArchieve2] = useState([]);
  const [allArchieve3, setAllArchieve3] = useState([]);
  const [allArchieve4, setAllArchieve4] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [allAnnouncements, setAllAnnouncements] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/employees").then(res => setAllEmployees(res.data));
    axios.get("http://localhost:5000/tasks").then(res => setAllTasks(res.data));
    axios.get("http://localhost:5000/complaints").then(res => setAllComplaints(res.data));
    axios.get("http://localhost:5000/announcements").then(res => setAllAnnouncements(res.data));

    axios.get("http://localhost:5000/employeesDeleted").then(res => setAllArchieve1(res.data));
    axios.get("http://localhost:5000/tasksDeleted").then(res => setAllArchieve2(res.data));
    axios.get("http://localhost:5000/complaintsDeleted").then(res => setAllArchieve3(res.data));
    axios.get("http://localhost:5000/announcementsDeleted").then(res => setAllArchieve4(res.data));
  }, []);

  return (
    <div className="p-8 bg-[#070B18] min-h-screen">
      <h1 className="text-2xl font-semibold text-cyan-400 mb-6">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <Card
          title="Employees"
          value={allEmployees.length}
          icon={<FaUsers />}
          color="cyan"
        />
        <Card
          title="Tasks"
          value={allTasks.length}
          icon={<FaTasks />}
          color="purple"
        />
        <Card
          title="Complaints"
          value={allComplaints.length}
          icon={<FaExclamationCircle />}
          color="red"
        />
        <Card
          title="Announcements"
          value={allAnnouncements.length}
          icon={<FaBullhorn />}
          color="blue"
        />
        <Card
          title="Archive"
          value={
            allArchieve1.length +
            allArchieve2.length +
            allArchieve3.length +
            allArchieve4.length
          }
          icon={<FaArchive />}
          color="yellow"
        />
      </div>
    </div>
  );
}

export default Dashboard;
