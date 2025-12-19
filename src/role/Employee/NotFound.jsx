import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center ">
        <h1 className="text-[40px] font-extrabold text-gray-900">404</h1>

        <p className="mt-4 text-[29px] font-semibold text-gray-800">
          Sahifa topilmadi
        </p>

        <p className="mt-3 text-[15px] text-gray-500 leading-10">
          Siz kiritgan manzil mavjud emas yoki sahifa o'chirilgan. Iltimos, bosh
          sahifaga qayting.
        </p>

        <Link
          to="/manager/dashboard"
          className="mt-8 block w-full rounded-2xl bg-blue-600 py-3
                     text-base  text-white hover:bg-blue-700"
        >
          Homega qaytish
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
