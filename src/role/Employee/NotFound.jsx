import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  const user = JSON.parse(localStorage.getItem("user"));

  const redirectPath = user
    ? user.role === "manager"
      ? "/manager/dashboard"
      : "/employee/home"
    : "/auth/signin";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 font-sans selection:bg-cyan-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-[#1e293b]/40 backdrop-blur-xl p-10 text-center shadow-2xl">
        <h1 className="text-[120px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          404
        </h1>

        <div className="mt-4 inline-block px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-bold tracking-widest uppercase">
          Sahifa topilmadi
        </div>

        <p className="mt-6 text-[16px] text-slate-400 leading-relaxed">
          Siz qidirayotgan sahifa mavjud emas yoki o‘chirilgan.
        </p>

        <Link
          to={redirectPath}
          className="mt-10 block w-full rounded-2xl bg-cyan-500 py-4 text-base font-bold text-[#0f172a] transition-all hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] active:scale-[0.98]"
        >
          XAVFSIZ HUDUDGA QAYTISH
        </Link>
        <div className="mt-8 flex justify-center gap-2">
          <div className="h-1 w-8 rounded-full bg-slate-800"></div>
          <div className="h-1 w-16 rounded-full bg-cyan-500/50"></div>
          <div className="h-1 w-8 rounded-full bg-slate-800"></div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
