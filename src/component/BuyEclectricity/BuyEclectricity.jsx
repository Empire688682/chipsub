"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const BuyElectricity = () => {
  const [formData, setFormData] = useState({
    disco: '',
    meterNumber: '',
    amount: '',
    phone: '',
    pin: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const { disco, meterNumber, amount, phone, pin } = formData;
  
    if (!disco || !meterNumber || !amount || !phone || !pin) {
      return toast.error("All fields are required!");
    }
  
    if (parseInt(amount, 10) < 100) {
      return toast.error("Minimum amount is ₦100");
    }
  
    toast.success("Electricity purchase submitted!");
    // TODO: Send data to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      <div className="max-w-lg mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-blue-100">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8 tracking-tight">
          Buy Electricity
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Disco Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Select Provider</label>
            <select
              name="disco"
              onChange={handleChange}
              value={formData.disco}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option disabled value="">-- Choose Provider --</option>
              <option value="ikeja">Ikeja Electric</option>
              <option value="eko">Eko Electric</option>
              <option value="abuja">Abuja Electric</option>
              <option value="ibadan">Ibadan Electric</option>
              <option value="portharcourt">Port Harcourt Electric</option>
            </select>
          </div>

          {/* Meter Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Meter Number</label>
            <input
              type="text"
              name="meterNumber"
              value={formData.meterNumber}
              onChange={handleChange}
              placeholder="e.g. 1234567890"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (₦)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Minimum ₦100"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 08012345678"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Pin */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Transaction PIN</label>
            <input
              type="password"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              placeholder="Enter your PIN"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

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

export default BuyElectricity;
