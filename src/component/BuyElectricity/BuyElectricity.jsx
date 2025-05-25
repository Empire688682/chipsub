"use client";
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import WalletBalance from '../WalletBalance/WalletBalance';
import ElectricityHelp from '../ElectricityHelp/ElectricityHelp';
import axios from 'axios';
import { FaSpinner } from "react-icons/fa";
import { useGlobalContext } from '../Context';

const BuyElectricity = () => {
  const { getUserRealTimeData, electricityMerchants } = useGlobalContext();
  const [electricityCompany, setElectricityCompany] = useState({});
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [verifyingMeter, setVerifyingMeter] = useState(false);
  const [purchasedToken, setPurchasedToken] = useState(null);

  const electricityUrl = "https://vtpass.com/api/merchant-verify"

  useEffect(() => {
    const getElectricityCompany = async () => {
      try {
        const response = await fetch(electricityUrl, {
          method: "GET",
        });
        const data = await response.json();

        if (data?.ELECTRIC_COMPANY) {
          setElectricityCompany(data.ELECTRIC_COMPANY);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getElectricityCompany();
  }, []);

  const [formData, setFormData] = useState({
    disco: '',
    meterNumber: '',
    meterType: '',
    amount: '',
    phone: '',
    pin: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const verifyMeterNumber = async (meterNumber, disco, meterType) => {

    if (meterNumber.length && disco && meterType) {
      setVerifyingMeter(true);
      try {
        const response = await axios.post('/api/verify-meter-number',
          { meterNumber, disco, meterType },
        );

        if (response.data.success) {
          setCustomerName(response.data.data);
          return true
        }
        else {
          return false
        }
      } catch (error) {
        console.log("Verify Meter Number Error:", error);
        setCustomerName("Invalid provider or meter number");
      }
      finally {
        setVerifyingMeter(false);
      }
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { disco, meterNumber, meterType, amount, phone, pin } = formData;

    if (!disco || !meterNumber || !amount || !phone || !pin) {
      return toast.error("All fields are required!");
    }

    if (parseInt(amount, 10) < 100) {
      return toast.error("Minimum amount is ₦100");
    }

    if (pin.length < 4) {
      return toast.error("Pin most be 4 digit");
    }

    const isMeterVerified = await verifyMeterNumber(meterNumber, disco);

    if (!isMeterVerified) {
      return toast.error("Meter verification failed");
    }

    setLoading(true)
    try {
      const response = await axios.post("/api/provider/electricity-provider", formData);
      console.log("Response:", response);
      if (response.data.success) {
        getUserRealTimeData()
        console.log("Response:", response.data.data);
        setPurchasedToken(response.data.data);
      }
    } catch (error) {
      console.log("Elect-Error:", error)
      toast.error(error.response.data.message);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      toast.info("Proccessing....")
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <ToastContainer />
      <div className='grid md:grid-cols-2 grid-cols-1 gap-6 justify-start '>
        <div className='flex flex-col gap-6'>

          <WalletBalance />

          <div className="max-w-2xl bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-blue-100">
            <h1 className="text-2xl font-bold text-center text-blue-700 mb-8 tracking-tight">
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
                  {electricityMerchants.map((merchant) => (
                    <option key={merchant.serviceID} value={merchant.serviceID}>
                      {merchant.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Meter Type</label>
                <select
                  name="meterType"
                  onChange={handleChange}
                  value={formData.meterType}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option disabled value="">-- Choose Meter Type --</option>
                 <option  value="prepaid">Prepaid</option>
                 <option  value="postpaid">Postpaid</option>
                </select>
              </div>

              {/* Meter Number */}
              <div className='relative'>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Meter Number</label>
                <input
                  type="text"
                  name="meterNumber"
                  value={formData.meterNumber}
                  onChange={handleChange}
                  placeholder="e.g. 1234567890"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  maxLength={11}
                />
                {
                  verifyingMeter && <span className="absolute right-[10px] top-[40px]">
                    <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                  </span>
                }
                {
                  customerName && customerName !== "Invalid provider or meter number" ? <p className='text-xs pt-2 font-bold text-green-500'>{customerName}</p>
                    :
                    <p className='text-xs pt-2 font-bold text-red-500'>{customerName}</p>
                }
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
                  maxLength={4}
                  placeholder="Enter your PIN"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || verifyingMeter}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 cursor-pointer transition duration-300"
              >
                {
                  loading ? "Proccessing..." : "Buy Now"
                }
              </button>
            </form>
          </div>

        </div>

        <ElectricityHelp data={formData} />

      </div>
    </div>
  );
};

export default BuyElectricity;
