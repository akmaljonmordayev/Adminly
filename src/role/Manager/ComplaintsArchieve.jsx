import React, { useEffect, useState } from "react";

function ComplaintsArchieve() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/complaintsDeleted")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Complaints Archive</h2>

      {data.length === 0 && <p>Archive bo‘sh</p>}

      {data.map((item) => (
        <div key={item.id} className="border p-3 mb-3 rounded">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p>Employee: {item.employeeName}</p>
          <p>Status: {item.status}</p>
          <small>Date: {item.date}</small>
        </div>
      ))}
    </div>
  );
}

export default ComplaintsArchieve;
