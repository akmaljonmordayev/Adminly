import React from "react";

function Logo() {
  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center justify-center p-6">
        <svg
          viewBox="0 0 420 120"
          className="w-72 h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="adminlyGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#C7B8FF" />
              <stop offset="100%" stopColor="#8B7CF6" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform="translate(20,20)">
            <rect
              x="0"
              y="0"
              rx="18"
              ry="18"
              width="80"
              height="80"
              fill="url(#adminlyGradient)"
              filter="url(#softGlow)"
            />
            <path
              d="M25 52 V38 c0-8 6-14 15-14 s15 6 15 14 v14"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* <circle cx="40" cy="54" r="3" fill="#ffffff" /> */}
          </g>

          <text
            x="130"
            y="75"
            fontSize="48"
            fontWeight="700"
            fill="url(#adminlyGradient)"
            style={{ letterSpacing: "0.5px" }}
          >
            Adminly
          </text>
        </svg>
      </div>
    </nav>
  );
}

export default Logo;
