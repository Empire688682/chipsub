"use client";
import React, { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WalletBalance from '../WalletBalance/WalletBalance';
import AirtimeHelp from '../AirtimeHelp/AirtimeHelp';

const BuyAirtime = () => {
  const [data, setData] = useState({
    network: "",
    amount: "",
    number: "",
    pin: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFormSubmission = (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!data.network) return toast.error("Please select a network");
    if (!data.amount || parseInt(data.amount) < 50) return toast.error("Amount must be at least ₦50");
    if (!/^\d{11}$/.test(data.number)) return toast.error("Enter a valid 11-digit phone number");
    if (data.pin.length < 6) return toast.error("PIN must be at least 6 digits");

    // 🔥 Simulate API success
    toast.success("Airtime purchase successful!");

    // Optionally reset form
    setData({
      network: "",
      amount: "",
      number: "",
      pin: "",
    });
  };

  return (
    <div className="min-h-screen py-10">
      <ToastContainer />
      <div className='grid md:grid-cols-2 grid-cols-1 gap-6 justify-start '>
        <div className='flex flex-col gap-6'>

          <WalletBalance />

          <div className="max-w-2xl bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-blue-100">
            <h1 className="text-2xl font-bold text-center text-blue-700 mb-8 tracking-tight">
              Buy Airtime
            </h1>

            <form onSubmit={handleFormSubmission} className="space-y-6">
              {/* Network */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Select Network
                </label>
                <select
                  name="network"
                  onChange={handleChange}
                  value={data.network}
                  required
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option disabled value="">-- Choose Network --</option>
                  <option value="mtn">MTN</option>
                  <option value="glo">GLO</option>
                  <option value="airtel">Airtel</option>
                  <option value="9mobile">9Mobile</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Enter Amount
                </label>
                <input
                  onChange={handleChange}
                  value={data.amount}
                  type="number"
                  name="amount"
                  min="50"
                  required
                  placeholder='Enter Amount / Min: 50'
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  onChange={handleChange}
                  value={data.number}
                  name="number"
                  type="tel"
                  placeholder="e.g. 09154358139"
                  required
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Pin */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Pin
                </label>
                <input
                  name="pin"
                  type="password"
                  onChange={handleChange}
                  value={data.pin}
                  placeholder="Enter Pin"
                  required
                  min={6}
                  max={6}
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition duration-300"
              >
                Buy Now
              </button>
            </form>
          </div>

        </div>

        <AirtimeHelp data={data} />

      </div>
    </div>
  );
};

export default BuyAirtime;
