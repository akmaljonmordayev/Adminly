import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBell } from 'react-icons/fa';

function MyAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/announcements')
      .then((res) => {
        setAnnouncements(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Xatolik yuz berdi!');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Yuklanmoqda...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-6 p-6">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          style={{ backgroundColor: '#0b1220' }}
          className="flex flex-col md:flex-row gap-4 shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="text-blue-400 text-3xl flex-shrink-0">
            <FaBell />
          </div>
          <div className="flex flex-col text-white">
            <h3 className="text-xl font-semibold mb-2">{announcement.title}</h3>
            <p className="mb-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {announcement.text}
            </p>
            <small className="text-gray-400">
              {new Date(announcement.date).toLocaleDateString()}
            </small>
            
          </div>
          
        </div>
      ))}
    </div>
  );
}

export default MyAnnouncements;
