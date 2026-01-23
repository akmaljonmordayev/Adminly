import React from "react";
import Card from "../../components/Card";
import { useState, useEffect } from "react";
import { FaUserCheck } from "react-icons/fa";
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
    const getData = async () => {
      let res = await axios.get("http://localhost:5000/employees");
      setAllEmployees(res.data);
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      let res = await axios.get("http://localhost:5000/tasks");
      setAllTasks(res.data);
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      let res = await axios.get("http://localhost:5000/complaints");
      setAllComplaints(res.data);
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      let res = await axios.get("http://localhost:5000/announcements");
      setAllAnnouncements(res.data);
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      let res = await axios.get("http://localhost:5000/employeesDeleted");
      setAllArchieve1(res.data);
      let ress = await axios.get("http://localhost:5000/tasksDeleted");
      setAllArchieve2(ress.data);
      let resss = await axios.get("http://localhost:5000/complaintsDeleted");
      setAllArchieve3(resss.data);
      let ressss = await axios.get(
        "http://localhost:5000/announcementsDeleted",
      );
      setAllArchieve4(ressss.data);
    };
    getData();
  }, []);

  return (
    <div>
      <Card
        title={"All Employees"}
        value={allEmployees.length}
        icon={<FaUserCheck />}
      />
      <Card
        title={"All Tasks"}
        value={allTasks.length}
        icon={<FaUserCheck />}
      />
      <Card
        title={"All Complaints"}
        value={allComplaints.length}
        icon={<FaUserCheck />}
      />
      <Card
        title={"All Announcements"}
        value={allAnnouncements.length}
        icon={<FaUserCheck />}
      />
      <Card
        title={"All Archieve"}
        value={
          allArchieve1.length +
          allArchieve2.length +
          allArchieve3.length +
          allArchieve4.length
        }
        icon={<FaUserCheck />}
      />
    </div>
  );
}

export default Dashboard;
