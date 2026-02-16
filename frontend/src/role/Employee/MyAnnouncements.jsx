import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBell, FaTimes } from 'react-icons/fa';

function MyAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('az');

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/announcements')
      .then((res) => {
        setAnnouncements(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Xatolik yuz berdi!');
        setLoading(false);
      });
  }, []);

  const filteredAndSorted = announcements
    .filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === 'az'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

  if (loading) return <p className="text-center mt-10 text-gray-500">Yuklanmoqda...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <>
      <div className="p-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 px-4 py-2 rounded-lg bg-gray-800 text-white outline-none"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full md:w-40 px-4 py-2 rounded-lg bg-gray-800 text-white"
          >
            <option value="az">A - Z</option>
            <option value="za">Z - A</option>
          </select>
        </div>

        <div className="flex flex-col gap-4">
          {filteredAndSorted.map((announcement) => (
            <div
              key={announcement.id}
              onClick={() => setSelected(announcement)}
              className="mx-auto w-full max-w-2xl cursor-pointer flex gap-4 bg-[#0b1220] p-6 rounded-xl shadow-lg hover:shadow-2xl transition"
            >
              <div className="text-blue-400 text-3xl">
                <FaBell />
              </div>

              <div className="text-white">
                <h3 className="text-xl font-semibold mb-1">
                  {announcement.title}
                </h3>
                <p className="text-gray-300 line-clamp-3">
                  {announcement.text}
                </p>
                <small className="text-gray-500 block mt-2">
                  {new Date(announcement.date).toLocaleDateString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0b1220] w-[95%] md:w-[600px] rounded-2xl p-6 shadow-2xl animate-[scaleIn_0.25s_ease-out]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-semibold">
                {selected.title}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-red-400"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <p className="text-gray-300 mb-4 whitespace-pre-line">
              {selected.text}
            </p>

            <small className="text-gray-500">
              {new Date(selected.date).toLocaleDateString()}
            </small>
          </div>

          <style>
            {`
              @keyframes scaleIn {
                from {
                  opacity: 0;
                  transform: scale(0.9);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}
          </style>
        </div>
      )}
    </>
  );
}

export default MyAnnouncements;
