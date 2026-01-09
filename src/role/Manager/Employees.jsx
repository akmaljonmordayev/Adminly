import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Employees() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [currentUser, setCurrentUser] = useState({
    id: "",
    fullName: "",
    email: "",
  });
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
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );
  const handleDelete = (id) => {
    if (!window.confirm("Delete this employee?")) return;

    fetch(`http://localhost:5000/employees/${id}`, {
      method: "DELETE",
    }).then(() => {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Employee deleted ✅");
    });
  };

  const handleEditOpen = (user) => {
    setCurrentUser({ ...user });
    setOpen(true);
  };

  const handleSave = () => {
    if (!currentUser.fullName || !currentUser.email) {
      toast.warn("All fields are required");
      return;
    }

    if (!currentUser.id) {
      fetch("http://localhost:5000/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser),
      })
        .then((res) => res.json())
        .then((newUser) => {
          setUsers((prev) => [...prev, newUser]);
          setOpen(false);
          toast.success("Employee added ✅");
        });
    }
    else {
      fetch(`http://localhost:5000/employees/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser),
      }).then(() => {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === currentUser.id ? currentUser : u
          )
        );
        setOpen(false);
        toast.info("Employee updated ✨");
      });
    }
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
            setCurrentUser({ id: "", fullName: "", email: "" });
            setOpen(true);
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
          {filteredUsers.map((user) => (
            <tr key={user.id} style={tr}>
              <td style={td}>{user.id}</td>
              <td style={td}>{user.fullName}</td>
              <td style={td}>{user.email}</td>
              <td style={td}>
                <button
                  onClick={() => handleEditOpen(user)}
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

      {open && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={{ color: "#22d3ee" }}>
              {currentUser.id ? "Edit Employee" : "Add Employee"}
            </h3>

            <input
              style={input}
              placeholder="Full Name"
              value={currentUser.fullName}
              onChange={(e) =>
                setCurrentUser({
                  ...currentUser,
                  fullName: e.target.value,
                })
              }
            />

            <input
              style={input}
              placeholder="Email"
              value={currentUser.email}
              onChange={(e) =>
                setCurrentUser({
                  ...currentUser,
                  email: e.target.value,
                })
              }
            />

            <div style={{ textAlign: "right" }}>
              <button
                onClick={() => setOpen(false)}
                style={{ ...btn, background: "#64748b" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{ ...btn, background: "#22d3ee" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </div>
  );
}


const topBar = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "16px",
};

const searchInput = {
  flex: 1,
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #1e293b",
  background: "#020617",
  color: "#e5e7eb",
  fontSize: "15px",
};

const addBtn = {
  border: "none",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  background: "#22d3ee",
  color: "#020617",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#020617",
  borderRadius: "12px",
};

const th = {
  padding: "12px",
  color: "#22d3ee",
  textAlign: "left",
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
  cursor: "pointer",
  marginRight: "8px",
  fontWeight: "600",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  background: "#020617",
  padding: "20px",
  borderRadius: "12px",
  width: "350px",
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
