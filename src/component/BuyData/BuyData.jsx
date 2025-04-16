"use client";
import React, { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BuyData = () => {
  const [form, setForm] = useState({
    network: "",
    plan: "",
    number: "",
    pin: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Basic Validation
    if (!form.network) return toast.error("Please select a network");
    if (!form.plan) return toast.error("Please choose a data plan");
    if (!/^\d{11}$/.test(form.number)) return toast.error("Enter a valid 11-digit phone number");
    if (form.pin.length < 6) return toast.error("PIN must be at least 6 digits");

    // 🚀 Simulate Success Toast
    toast.success("Data purchase successful!");

    // Optionally reset form
    setForm({
      network: "",
      plan: "",
      number: "",
      pin: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      <ToastContainer />
      <div className="max-w-lg mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-blue-100">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8 tracking-tight">
          Buy Data Plan
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Network */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Select Network
            </label>
            <select
              name="network"
              onChange={handleChange}
              value={form.network}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option disabled value="">-- Choose Network --</option>
              <option value="mtn">MTN</option>
              <option value="glo">GLO</option>
              <option value="airtel">Airtel</option>
              <option value="9mobile">9Mobile</option>
            </select>
          </div>

          {/* Data Plan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Choose Data Plan
            </label>
            <select
              name="plan"
              onChange={handleChange}
              value={form.plan}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option disabled value="">-- Choose Plan --</option>
              <option value="1gb">1GB - ₦500</option>
              <option value="2gb">2GB - ₦900</option>
              <option value="5gb">5GB - ₦2200</option>
            </select>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              name="number"
              type="tel"
              onChange={handleChange}
              value={form.number}
              placeholder="e.g. 08012345678"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* PIN */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Enter PIN
            </label>
            <input
              name="pin"
              type="password"
              onChange={handleChange}
              value={form.pin}
              placeholder="6 digit PIN"
              required
              maxLength={6}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Buy Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyData;
