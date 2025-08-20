import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaRupeeSign, FaHeart } from "react-icons/fa";

const PaymentForm = () => {
  const [form, setForm] = useState({
    txnid: Date.now().toString(),
    amount: "",
    firstname: "",
    email: "",
    phone: "",
    productinfo: "Donation",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    // Create form and auto-submit to PayU
    const tempForm = document.createElement("form");
    tempForm.method = "POST";
    tempForm.action = data.action;

    Object.entries(data.params).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      tempForm.appendChild(input);
    });

    document.body.appendChild(tempForm);
    tempForm.submit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-10 border border-green-100">
        <div className="text-center mb-8">
          <FaHeart className="text-green-600 text-5xl mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-green-700">Make a Difference</h1>
          <p className="text-gray-600 mt-2">
            Your contribution helps us bring change. Donate securely below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-green-500">
            <FaUser className="text-gray-400 mr-3" />
            <input
              type="text"
              name="firstname"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-green-500">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-green-500">
            <FaPhone className="text-gray-400 mr-3" />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none"
            />
          </div>

          {/* Amount */}
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-green-500">
            <FaRupeeSign className="text-gray-400 mr-3" />
            <input
              type="number"
              name="amount"
              placeholder="Donation Amount (₹)"
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200"
          >
            <FaHeart className="animate-pulse" /> Donate Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
