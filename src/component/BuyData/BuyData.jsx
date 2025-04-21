"use client";
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataHelp from '../DataHelp/DataHelp';
import WalletBalance from '../WalletBalance/WalletBalance';
import { useGlobalContext } from '../Context';

const PROFIT_TYPE = "flat"; // "flat" or "percent"
const PROFIT_VALUE = 50; // ₦50 flat or 10%

const BuyData = () => {
  const { dataPlan } = useGlobalContext();

  const [form, setForm] = useState({
    network: "",
    plan: "",
    amount: "",
    number: "",
    pin: ""
  });

  const [availablePlans, setAvailablePlans] = useState([]);

  const handleNetworkChange = (e) => {
    const selected = e.target.value;
    setForm({ ...form, network: selected, plan: "", amount: "" });

    const plans = dataPlan?.MOBILE_NETWORK?.[selected]?.[0]?.PRODUCT || [];

    const enhancedPlans = plans.map(item => {
      const basePrice = Number(item.PRODUCT_AMOUNT);
      const finalPrice = PROFIT_TYPE === "flat"
        ? basePrice + PROFIT_VALUE
        : Math.ceil(basePrice + (basePrice * PROFIT_VALUE / 100));

      return {
        name: item.PRODUCT_NAME,
        code: item.PRODUCT_ID, // in case you need to send ID
        price: basePrice,
        sellingPrice: Math.ceil(finalPrice),
      };
    });

    setAvailablePlans(enhancedPlans);
  };

  const handlePlanChange = (e) => {
    const selected = e.target.value;
    const plan = availablePlans.find(p => p.name === selected);
    if (plan) {
      setForm({ ...form, plan: selected, amount: plan.sellingPrice });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.network) return toast.error("Please select a network");
    if (!form.plan) return toast.error("Please choose a data plan");
    if (!/^\d{11}$/.test(form.number)) return toast.error("Enter a valid 11-digit phone number");
    if (form.pin.length < 6) return toast.error("PIN must be at least 6 digits");

    // 🔥 Submit the purchase logic here

    toast.success("Data purchase successful!");

    setForm({
      network: "",
      plan: "",
      amount: "",
      number: "",
      pin: ""
    });
    setAvailablePlans([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <ToastContainer />
      {dataPlan ? (
        <div className='grid md:grid-cols-2 grid-cols-1 gap-6 justify-start'>
          <div className='flex flex-col gap-6'>
            <WalletBalance />
            <div className="max-w-2xl bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-blue-100">
              <h1 className="text-2xl font-bold text-center text-blue-700 mb-8 tracking-tight">Buy Data</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Network */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Select Network</label>
                  <select
                    name="network"
                    onChange={handleNetworkChange}
                    value={form.network}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option disabled value="">-- Choose Network --</option>
                    {
                      Object.keys(dataPlan?.MOBILE_NETWORK || {}).map((net, i) => (
                        <option value={net} key={i}>{net}</option>
                      ))
                    }
                  </select>
                </div>

                {/* Data Plan */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Choose Data Plan</label>
                  <select
                    name="plan"
                    onChange={handlePlanChange}
                    value={form.plan}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option disabled value="">-- Choose Plan --</option>
                    {
                      availablePlans.map((p, i) => (
                        <option key={i} value={p.name}>{p.name} - ₦{p.sellingPrice}</option>
                      ))
                    }
                  </select>
                </div>

                {/* Auto Amount (readonly) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Amount</label>
                  <input
                    name="amount"
                    type="text"
                    readOnly
                    value={form.amount}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-gray-600"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Enter PIN</label>
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

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition duration-300"
                >
                  Buy Now
                </button>
              </form>
            </div>
          </div>

          <DataHelp data={form} />
        </div>
      ) : (
        <div>Loading.....</div>
      )}
    </div>
  );
};

export default BuyData;
