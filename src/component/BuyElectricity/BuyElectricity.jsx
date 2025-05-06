"use client";
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import WalletBalance from '../WalletBalance/WalletBalance';
import ElectricityHelp from '../ElectricityHelp/ElectricityHelp';
import axios from 'axios';
import { FaSpinner } from "react-icons/fa";

const BuyElectricity = () => {
  const [electricityCompany, setElectricityCompany] = useState({});
  const [isMeterVerified, setIsMeterVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [verifyingMeter, setVerifyingMeter] = useState(true);

  const electricityUrl = "https://www.nellobytesystems.com/APIElectricityDiscosV1.asp"

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
    amount: '',
    phone: '',
    pin: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const verifyMeterNumber = async (meterNumber, disco) => {

    if (meterNumber.length === 11 && disco) {
      setVerifyingMeter(true);
      try {
        const response = await axios.post('/api/verify-meter-number',
          { meterNumber, disco },
        );

        console.log("Verify Meter Number Response:", response);

        if (response.data.success) {
          setIsMeterVerified(true);
          setCustomerName(response.data.data);
        }
      } catch (error) {
        console.log("Verify Meter Number Error:", error);
        setCustomerName("Invalid provider or meter number");
        setIsMeterVerified(false);
      }
      finally{
        setVerifyingMeter(false);
      }
    }

  };

  useEffect(()=>{
    verifyMeterNumber(formData.meterNumber, formData.disco);
  }, [handleChange]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { disco, meterNumber, amount, phone, pin } = formData;

    if (!disco || !meterNumber || !amount || !phone || !pin) {
      return toast.error("All fields are required!");
    }

    if (parseInt(amount, 10) < 100) {
      return toast.error("Minimum amount is ₦100");
    }

    setLoading(true)
    try {
      
    } catch (error) {
      conslole.log("Elect-Error:", error)
    }
    finally{
      setLoading(false);
    }
  };

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
                  {
                    electricityCompany && Object.keys(electricityCompany)?.map((company, index) => (
                      <option key={index} value={company}>{company}</option>
                    ))
                  }
                </select>
              </div>

              {/* Meter Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 relative">Meter Number</label>
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
                  verifyingMeter && <span className="absolute right-[10px] top-[10px]">
                    <FaSpinner className="animate-spin text-blue-600 text-2xl"/>
                  </span>
                }
                {
                  customerName && customerName !== "Invalid provider or meter number"? <p className='text-xs pt-2 font-bold text-green-500'>{customerName}</p>
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
                  placeholder="Enter your PIN"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {
                isMeterVerified ? <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 cursor-pointer transition duration-300"
              >
                Buy Now
              </button>
              :
              <p
                className="w-full bg-blue-200 text-white py-3 text-center rounded-xl text-lg font-semibold "
              >
                Buy Now
              </p>
              }
            </form>
          </div>

        </div>

        <ElectricityHelp data={formData} />

      </div>
    </div>
  );
};

export default BuyElectricity;
