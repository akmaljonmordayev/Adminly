import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../../components/Card";
import {
  FaTasks,
  FaBullhorn,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [complaints, setComplaints] = useState([]);

  let user = JSON.parse(localStorage.getItem("user"));

  const getTasks = async () => {
    let res = await axios.get("http://localhost:5000/tasks");
    let filterData = res.data?.filter(
      (item) => item.employeeName === user.fullName
    );
    setTasks(filterData);
  };

  const getAnnouncements = async () => {
    let res = await axios.get("http://localhost:5000/announcements");
    setAnnouncements(res.data);
  };

  const getComplaints = async () => {
    let res = await axios.get("http://localhost:5000/complaints");
    let filterData = res.data?.filter(
      (item) => item.employeeName === user.fullName
    );
    setComplaints(filterData);
  };

  useEffect(() => {
    getTasks();
    getAnnouncements();
    getComplaints();
  }, []);

  return (
    <div className="p-10">

      <div className="flex justify-center gap-20 mb-16">
        <Card
          title="TASKS"
          value={tasks?.length || 0}
          icon={<FaTasks />}
          color="red"
        />
        <Card
          title="ANNOUNCEMENTS"
          value={announcements?.length || 0}
          icon={<FaBullhorn />}
          color="blue"
        />
        <Card
          title="COMPLAINTS"
          value={complaints?.length || 0}
          icon={<FaExclamationCircle />}
          color="yellow"
        />
      </div>

















      <div className="max-w-4xl mx-auto text-white shadow-blue-200 rounded-2xl shadow-xl p-10">
        <h2 className="text-2xl font-semiboldtext-white mb-10 text-white">
          Monthly Progres
        </h2>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-white font-medium">
              February Myprofit
            </span>
            <span className="font-semibold text-white">78%</span>
          </div>
          <div className="w-full bg-blue-200 h-3 rounded-full">
            <div className="bg-blue-600 h-3 rounded-full w-[78%]"></div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-white font-medium">
              User mytasks
            </span>
            <span className="font-semibold text-white">65%</span>
          </div>
          <div className="w-full bg-blue-200 h-3 rounded-full">
            <div className="bg-blue-500 h-3 rounded-full w-[65%]"></div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2 items-center">
            <span className="text-white font-medium">
              Customer Mycomplaints
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">92%</span>
              <FaCheckCircle className="text-green-500" />
            </div>
          </div>
          <div className="w-full bg-blue-200 h-3 rounded-full">
            <div className="bg-green-500 h-3 rounded-full w-[92%]"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2 items-center">
            <span className="text-white font-medium">
              Service MyAnnountsments
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">88%</span>
              <FaTimesCircle className="text-red-500" />
            </div>
          </div>
          <div className="w-full bg-blue-200 h-3 rounded-full">
            <div className="bg-red-500 h-3 rounded-full w-[88%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;