"use client";
import React, { useEffect, useState } from "react";
import WalletBalance from '../WalletBalance/WalletBalance';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TvHelp from "../TvHelp/TvHelp";
import axios from 'axios';
import { FaSpinner } from "react-icons/fa";

const BuyTv = () => {
  const allTvPackagesUrl = "https://www.nellobytesystems.com/APICableTVPackagesV2.asp";
  const [form, setForm] = useState({
    provider: "",
    smartcardNumber: "",
    packageCode: "",
    phone: "",
    pin: ""
  });
  const [packagesData, setPackagesData] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [verifyingSmartcardNumber, setVerifyingSmartcardNumber] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(allTvPackagesUrl, { method: "GET" });
        const data = await res.json();
        if (data) {
          setPackagesData(data.TV_ID || [])
        }
        console.log("data:", data)
      } catch (error) {
        console.log("Fetching-Error:", error);
      }
    }
    fetchPackages();
  }, []);

  const [availablePackages, setAvailablePackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (form.provider) {
      const providerPackage = packagesData[form.provider];
      if (providerPackage) {
        setAvailablePackages(providerPackage[0].PRODUCT);
      }
    }
  }, [form.provider]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Verifies a given smartcard number and provider combination, and updates
 * the customerName state variable with the result.
 *
 * @param {string} smartcardNumber - Smartcard number to verify.
 * @param {string} provider - TV provider to verify against.
 * @returns {boolean} True if verification succeeds, false otherwise.
 */
/*******  5f6311f1-72ed-4eef-8f9c-06fcd02994ab  *******/
  const verifySmartcardNumber = async (smartcardNumber, provider) => {
  setVerifyingSmartcardNumber(true);

  try {
    const response = await axios.post('/api/verify-uic-tv-number', {
      smartcardNumber,
      provider,
    });

    if (response.data.success) {
      (true);
      setCustomerName(response.data.data); // Assuming 'data' contains the customer name
      return true;
    } else {
      setCustomerName("Verification failed");
      return false;
    }
  } catch (error) {
    console.log("Verify SmartcardNumber Error:", error);
    setCustomerName("Invalid provider or Smartcard Number");
    return false;
  } finally {
    setVerifyingSmartcardNumber(false);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const { provider, smartcardNumber, packageCode, phone, pin } = form;

  if (!provider || !smartcardNumber || !packageCode || !phone || pin.length < 4) {
    toast.error("Please fill all fields correctly");
    return;
  }

  const isVerified = await verifySmartcardNumber(smartcardNumber, provider);

  if (!isVerified) {
    toast.error("Smartcard verification failed");
    return;
  }

  try {
    setLoading(true);
    // Submit logic here
    console.log("Submitted TV Subscription:", form);
    toast.success("TV subscription successful!");

    setForm({
      provider: "",
      smartcardNumber: "",
      packageCode: "",
      phone: "",
      pin: ""
    });
    setAvailablePackages([]);
    setCustomerName("");
  } catch (error) {
    toast.error("Subscription failed");
    console.error("TV Subscription Error:", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <ToastContainer />
      <div className='grid md:grid-cols-2 grid-cols-1 gap-6 justify-start'>
        <div className='flex flex-col gap-6'>
          <WalletBalance />
          <div className="max-w-2xl bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-blue-100">
            <h1 className="text-2xl font-bold text-center text-blue-700 mb-8 tracking-tight">Buy TV Subscription</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Provider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">TV Provider</label>
                <select
                  name="provider"
                  onChange={handleChange}
                  value={form.provider}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">-- Select Provider --</option>
                  {Object.keys(packagesData || {}).map((p, i) => (
                    <option key={i} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Smartcard */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Smartcard / Decoder Number</label>
                <input
                  name="smartcardNumber"
                  type="text"
                  onChange={handleChange}
                  value={form.smartcardNumber}
                  maxLength={12}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {
                  verifyingSmartcardNumber && <span className="absolute right-[10px] top-[30px]">
                    <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                  </span>
                }
                {
                  customerName && customerName !== "Invalid provider or Smartcard Number" ? <p className='text-xs pt-2 font-bold text-green-500'>{customerName}</p>
                    :
                    <p className='text-xs pt-2 font-bold text-red-500'>{customerName}</p>
                }
              </div>

              {/* Package */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">TV Package</label>
                <select
                  name="packageCode"
                  onChange={handleChange}
                  value={form.packageCode}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">-- Select Package --</option>
                  {availablePackages.map((pkg, i) => (
                    <option key={i} value={pkg.PACKAGE_AMOUNT}>
                      {pkg.PACKAGE_NAME} - ₦{pkg.PACKAGE_AMOUNT}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  onChange={handleChange}
                  value={form.phone}
                  placeholder="e.g. 08012345678"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* PIN */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Transaction PIN</label>
                <input
                  name="pin"
                  type="password"
                  onChange={handleChange}
                  value={form.pin}
                  placeholder="4 digit PIN"
                  required
                  maxLength={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

               <button
                type="submit"
                disabled={loading || verifyingSmartcardNumber}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 cursor-pointer transition duration-300"
              >
                {
                  loading ? "Proccessing..." :"Subcribe"
                }
              </button>

            </form>
          </div>
        </div>

        <TvHelp data={form} />
      </div>
    </div>
  );
};

export default BuyTv;
