import React from "react";

function Loader() {
  return (
    <div>
      <div class="flex items-center justify-center min-h-screen">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
      </div>
    </div>
  );
}

export default Loader;
