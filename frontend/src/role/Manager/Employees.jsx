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

  const [editUser, setEditUser] = useState({
    id: "",
    fullName: "",
    email: "",
  });

  const [newFullname, setNewFullname] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newSalary, setNewSalary] = useState("");

  const [search, setSearch] = useState("");

  const getNow = () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/employees");
      setUsers(res.data);
      setLoading(false);
    } catch {
      toast.error("Server error!");
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // ADD
  const handleAdd = async () => {
    if (!newFullname || !newEmail) {
      toast.warn("Required fields missing");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/employees", {
        fullName: newFullname,
        email: newEmail,
        hireDate: getNow(),
        baseSalary: newSalary,
        kpiPercent: 0,
        kpiAmount: 0,
        bonus: "",
        penalty: "0",
        totalSalary: 0,
        month: "",
        status: "pending",
        paymentDate: "",
        paymentMethod: "",
        comment: "",
        leaves: [],
        createdAt: new Date().toISOString(),
      });

      if (res.status === 201) {
        toast.success("Employee created");
        setAddOpen(false);
        setNewFullname("");
        setNewEmail("");
        setNewSalary("");
        getData();
      }
    } catch {
      toast.error("Create error");
    }
  };

  // EDIT
  const handleEdit = async () => {
    await axios.put(
      `http://localhost:5000/employees/${editUser.id}`,
      editUser
    );
    toast.info("Employee updated");
    setEditOpen(false);
    getData();
  };

  // DELETE + ARCHIVE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    const res = await axios.get(`http://localhost:5000/employees/${id}`);

    const { id: _, ...archivedEmployee } = res.data;

    await axios.post(
      "http://localhost:5000/employeesDeleted",
      archivedEmployee
    );

    await axios.delete(`http://localhost:5000/employees/${id}`);

    toast.success("Employee deleted & archived");
    getData();
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

        <button style={addBtn} onClick={() => setAddOpen(true)}>
          + Add Employee
        </button>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#0f172a" }}>
            <th style={th}>#</th>
            <th style={th}>Full Name</th>
            <th style={th}>Email</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u, index) => (
            <tr key={u.id} style={tr}>
              <td style={td}>{index + 1}</td>
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

      <Modal
        title="Add Employee"
        open={addOpen}
        onOk={handleAdd}
        onCancel={() => setAddOpen(false)}
        okText="Add"
      >
        <input
          style={input}
          placeholder="Full name"
          value={newFullname}
          onChange={(e) => setNewFullname(e.target.value)}
        />
        <input
          style={input}
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <input
          style={input}
          placeholder="Base salary"
          value={newSalary}
          onChange={(e) => setNewSalary(e.target.value)}
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
          value={editUser.fullName}
          onChange={(e) =>
            setEditUser({ ...editUser, fullName: e.target.value })
          }
        />
        <input
          style={input}
          value={editUser.email}
          onChange={(e) =>
            setEditUser({ ...editUser, email: e.target.value })
          }
        />
      </Modal>

      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </div>
  );
}

/* styles */
const topBar = { display: "flex", gap: "16px", marginBottom: "16px" };
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
