import React from "react";

function Logo() {
  return (
    <nav className="flex items-center justify-between">
    <div className="flex items-center">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="#B37BFF">
          <rect x="3" y="3" rx="2" width="18" height="3" />
          <rect x="3" y="9" rx="2" width="18" height="3" opacity="0.95" />
          <rect x="3" y="15" rx="2" width="12" height="3" opacity="0.8" />
        </g>
      </svg>

      <span className="text-[16px] font-semibold" style={{ color: "#B37BFF" }}>
        adminly
      </span>
    </div>
    </nav>
  );
}

export default Logo;
