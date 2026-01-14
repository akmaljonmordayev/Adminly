import axios from "axios";
import React, { useEffect, useState } from "react";

function AnnouncementsArchieve() {
  const [data, setData] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        let res = await axios.get("http://localhost:5000/announcementsDeleted");
        setData(res.data);
      } catch (error) {
        setErr(error.message);
      }
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen  p-6 ">
      <h1 className="text-3xl font-bold text-center mb-8">
        🗂 Archived Announcements
      </h1>

      {err && (
        <p className="text-red-500 text-center mb-6">{err}</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map(({ id, title, text, date, status }) => (
          <div
            key={id}
            className="bg-[#0f172a] text-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
          >
            {/* Title */}
            <h2 className="text-xl font-semibold text-white mb-2">
              {title}
            </h2>

            {/* Text */}
            <p className="text-white mb-4 line-clamp-3">
              {text}
            </p>

            {/* Date & Status */}
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="text-white">📅 {date}</span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  status === "deleted"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {status}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
                Restore
              </button>

              <button className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnnouncementsArchieve;
