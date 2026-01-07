import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

function Employees() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/employees")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this employee?")) return;
   toast.info("Siz tizimdan chiqdingiz!")
    fetch(`http://localhost:5000/employees/${id}`, {
      method: "DELETE",
    }).then(() => {
      setUsers(users.filter((u) => u.id !== id));
    });
  };

  const handleEdit = (user) => {
    const newName = prompt("New name:", user.name);
    if (!newName) return;

    fetch(`http://localhost:5000/employees/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, name: newName }),
    }).then(() => {
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, name: newName } : u))
      );
    });
  };

  if (loading) return <p style={{ color: "#22d3ee" }}>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#22d3ee", marginBottom: "15px" }}>Employees</h2>

      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#0f172a" }}>
            <th style={th}>ID</th>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={tr}>
              <td style={td}>{user.id}</td>
              <td style={td}>{user.fullName}</td>
              <td style={td}>?</td>
              <td style={td}>
                <button
                  onClick={() => handleEdit(user)}
                  style={{ ...btn, background: "#22d3ee" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{ ...btn, background: "#ef4444" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#020617",
  borderRadius: "12px",
  overflow: "hidden",
};

const th = {
  padding: "12px",
  textAlign: "left",
  color: "#22d3ee",
};

const td = {
  padding: "12px",
  color: "#e5e7eb",
};

const tr = {
  borderBottom: "1px solid #1e293b",
};

const btn = {
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  color: "#020617",
  cursor: "pointer",
  marginRight: "8px",
  fontWeight: "600",
};

export default Employees;
