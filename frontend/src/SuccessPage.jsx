import React, { useEffect } from "react";
import Confetti from "react-confetti";
import { FaCheckCircle } from "react-icons/fa";

const SuccessPage = () => {
  useEffect(() => {
    // scroll to top when mounted
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center">
      <Confetti />
      <FaCheckCircle className="text-green-600 text-6xl mb-4 animate-bounce" />
      <h1 className="text-4xl font-bold text-green-700">Thank You!</h1>
      <p className="text-gray-600 mt-2 max-w-md">
        Your donation has been received successfully. Your support helps us
        create meaningful change!
      </p>
      <a
        href="/"
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all"
      >
        Back to Home
      </a>
    </div>
  );
};

export default SuccessPage;
