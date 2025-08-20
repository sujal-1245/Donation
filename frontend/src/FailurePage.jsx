import React from "react";
import { FaTimesCircle } from "react-icons/fa";

const FailurePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center">
      <FaTimesCircle className="text-red-600 text-6xl mb-4 animate-pulse" />
      <h1 className="text-4xl font-bold text-red-700">Payment Failed</h1>
      <p className="text-gray-600 mt-2 max-w-md">
        Oops! Something went wrong with your donation. Don’t worry — you can try
        again securely.
      </p>
      <a
        href="/donate"
        className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all"
      >
        Try Again
      </a>
    </div>
  );
};

export default FailurePage;
