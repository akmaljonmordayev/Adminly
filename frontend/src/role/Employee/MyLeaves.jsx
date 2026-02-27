import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

function MyLeaves() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    department: "",
    position: "",
    reason: "",
    description: "",
  });

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const format = (d) => d.toISOString().split("T")[0];

  useEffect(() => {
    axios
      .get("http://localhost:5000/resignationLeaves")
      .then((res) => setData(res.data));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();

    const newItem = {
      ...form,
      today: format(today),
      yesterday: format(yesterday),
      status: "pending",
    };

    axios
      .post("http://localhost:5000/resignationLeaves", newItem)
      .then((res) => {
        setData([...data, res.data]);
        setOpen(false);
      });
  }

  return (
    <div className="p-6 bg-[#020c1b] text-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 tracking-wide">
            My Resignation Leaves
          </h1>
          <p className="text-gray-400 mt-1">
            Barcha yuborilgan arizalar ro‘yxati
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-6 py-3 rounded-2xl 
    bg-gradient-to-r from-cyan-500 to-blue-500
    hover:from-cyan-400 hover:to-blue-400
    transition-all font-semibold shadow-lg shadow-cyan-500/30"
        >
          + Ariza qo‘shish
        </button>
      </div>

      <div className="border-b border-cyan-600 my-4"></div>

      {!selected ? (
  <div className="grid gap-4">
    {data.map((item) => (
      <div
        key={item.id}
        onClick={() => setSelected(item)}
        className="border border-cyan-600 rounded-xl p-4 bg-[#03142a] cursor-pointer hover:border-cyan-400 transition"
      >
        <h3 className="text-lg font-bold text-cyan-400">
          {item.department}
        </h3>
        <p>{item.position}</p>
        <p className="text-sm text-gray-400">{item.reason}</p>

        <div className="flex gap-6 mt-3 text-sm">
          <span>Bugun: {item.today}</span>
          <span>Kecha: {item.yesterday}</span>
          <span className="text-yellow-400">{item.status}</span>
        </div>
      </div>
    ))}
  </div>
) : (
  
  <div className="bg-[#03142a] border border-cyan-500 rounded-2xl p-8 shadow-lg">
    
    <button
      onClick={() => setSelected(null)}
      className="mb-6 text-sm text-cyan-400 hover:underline"
    >
      ← Orqaga
    </button>

    <h2 className="text-3xl font-bold text-cyan-400 mb-4">
      {selected.department}
    </h2>

    <div className="space-y-3">
      <p><b>Position:</b> {selected.position}</p>
      <p><b>Reason:</b> {selected.reason}</p>
      <p className="mt-3">{selected.description}</p>
    </div>

    <div className="flex gap-6 mt-6 text-sm">
      <span>Bugun: {selected.today}</span>
      <span>Kecha: {selected.yesterday}</span>
      <span className="text-yellow-400">{selected.status}</span>
    </div>

  </div>
)}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <form
            onSubmit={submit}
            className="bg-[#03142a] p-6 rounded-2xl w-[400px] border border-cyan-500"
          >
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Ariza qoshish
            </h2>

            <input
              name="department"
              placeholder="Department"
              onChange={handleChange}
              className="w-full mb-3 p-2 rounded bg-[#020c1b] border border-cyan-600"
            />

            <input
              name="position"
              placeholder="Position"
              onChange={handleChange}
              className="w-full mb-3 p-2 rounded bg-[#020c1b] border border-cyan-600"
            />

            <input
              name="reason"
              placeholder="Reason"
              onChange={handleChange}
              className="w-full mb-3 p-2 rounded bg-[#020c1b] border border-cyan-600"
            />

            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className="w-full mb-3 p-2 rounded bg-[#020c1b] border border-cyan-600"
            />

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded bg-gray-700"
              >
                Bekor qilish
              </button>

              <button className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-600">
                Saqlash
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default MyLeaves;
