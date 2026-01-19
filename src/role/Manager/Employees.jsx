import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

function Employees() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    BaseSalary: "",
    createdAt: "",
  });

  const [editUser, setEditUser] = useState({
    id: "",
    fullName: "",
    email: "",
  });

  const [search, setSearch] = useState("");

  const getNow = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth());
    const day = String(now.getDate());
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetch("http://localhost:5000/employees")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Server error!");
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newUser.fullName || !newUser.email) {
      toast.warn("Required fields missing");
      return;
    }

    fetch("http://localhost:5000/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers((prev) => [...prev, data]);
        setAddOpen(false);
        toast.success("Employee added ✅");
      });
  };

  const handleEdit = () => {
    fetch(`http://localhost:5000/employees/${editUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editUser),
    }).then(() => {
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? editUser : u))
      );
      setEditOpen(false);
      toast.info("Employee updated ✨");
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    let res = await axios.get(`http://localhost:5000/employees/${id}`);
    let ress = await axios.post(
      "http://localhost:5000/employeesDeleted",
      res.data
    );
    await fetch(`http://localhost:5000/employees/${id}`, {
      method: "DELETE",
    }).then(() => {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Employee deleted and archieved ❌");
    });
  };

  if (loading) return <p style={{ color: "#22d3ee" }}>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={topBar}>
        <input
          style={searchInput}
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          style={addBtn}
          onClick={() => {
            setNewUser({
              fullName: "",
              email: "",
              phone: "",
              BaseSalary: "",
              createdAt: getNow(),
            });
            setAddOpen(true);
          }}
        >
          + Add Employee
        </button>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#0f172a" }}>
            <th style={th}>ID</th>
            <th style={th}>Full Name</th>
            <th style={th}>Email</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id} style={tr}>
              <td style={td}>{u.id}</td>
              <td style={td}>{u.fullName}</td>
              <td style={td}>{u.email}</td>
              <td style={td}>
                <button
                  style={{ ...btn, background: "#22d3ee" }}
                  onClick={() => {
                    setEditUser(u);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  style={{ ...btn, background: "#ef4444" }}
                  onClick={() => handleDelete(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>
        {`
 .ant-modal-title { 
    color: #22d3ee !important;
 }
  .ant-modal-container {
    background-color: #071B2D !important;

  }

`}
      </style>
      <Modal
        title="Add Employee"
        open={addOpen}
        onOk={handleAdd}
        onCancel={() => setAddOpen(false)}
        okText="Add"
        className="text-[#ffff]"
      >
        <input
          style={input}
          placeholder="Full name"
          value={newUser.fullName}
          onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
        />

        <input
          style={input}
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />

        <input
          style={input}
          placeholder="BaseSalary"
          value={newUser.BaseSalary}
          onChange={(e) =>
            setNewUser({ ...newUser, BaseSalary: e.target.value })
          }
        />

        <input
          type="datetime-local"
          style={input}
          value={newUser.createdAt}
          disabled
        />
      </Modal>

      <Modal
        title="Edit Employee"
        open={editOpen}
        onOk={handleEdit}
        onCancel={() => setEditOpen(false)}
        okText="Save"
      >
        <input
          style={input}
          placeholder="Full name"
          value={editUser.fullName}
          onChange={(e) =>
            setEditUser({ ...editUser, fullName: e.target.value })
          }
        />

        <input
          style={input}
          placeholder="Email"
          value={editUser.email}
          onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
        />
      </Modal>

      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </div>
  );
}

const topBar = {
  display: "flex",
  gap: "16px",
  marginBottom: "16px",
};

const searchInput = {
  flex: 1,
  padding: "10px",
  borderRadius: "10px",
  background: "#020617",
  border: "1px solid #1e293b",
  color: "#e5e7eb",
};

const addBtn = {
  padding: "10px 18px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  background: "#22d3ee",
  fontWeight: "600",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#020617",
};

const th = { padding: "12px", color: "#22d3ee" };
const td = { padding: "12px", color: "#e5e7eb" };
const tr = { borderBottom: "1px solid #1e293b" };

const btn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  marginRight: "6px",
  fontWeight: "600",
};

const input = {
  width: "100%",
  padding: "8px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "1px solid #1e293b",
  background: "#020617",
  color: "#e5e7eb",
};

export default Employees;
