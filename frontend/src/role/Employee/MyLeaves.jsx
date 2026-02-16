import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

function MyLeaves() {
  const [data, setData] = useState([]);
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
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-xl font-semibold"
        >
          + Ariza qoshish
        </button>
      </div>

      <div className="border-b border-cyan-600 my-4"></div>

      <div className="grid gap-4">
        {data.map((item, i) => (
          <div
            key={i}
            className="border border-cyan-600 rounded-xl p-4 bg-[#03142a]"
          >
            <h3 className="text-lg font-bold text-cyan-400">
              {item.department}
            </h3>

            <p>{item.position}</p>
            <p className="text-sm text-gray-400">{item.reason}</p>
            <p className="mt-2">{item.description}</p>

            <div className="flex gap-6 mt-3 text-sm">
              <span>Bugun: {item.today}</span>
              <span>Kecha: {item.yesterday}</span>
              <span className="text-yellow-400">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
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
