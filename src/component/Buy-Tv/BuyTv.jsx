"use client";

import React, { useEffect, useState } from "react";

const BuyTv = () => {
  const [tvPackages, setTvPackages] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [availablePackages, setAvailablePackages] = useState([]);
  const [formData, setFormData] = useState({
    provider: "",
    smartcardNumber: "",
    packageCode: "",
    phone: "",
    pin: "",
  });

  const allTvPackagesUrl = "https://www.nellobytesystems.com/APICableTVPackagesV2.asp";

  useEffect(() => {
    const fetchTvPackages = async () => {
      try {
        const res = await fetch(allTvPackagesUrl);
        const data = await res.json();
        setTvPackages(data);
      } catch (error) {
        console.error("Failed to load TV packages", error);
      }
    };

    fetchTvPackages();
  }, []);

  // Update available packages when provider changes
  useEffect(() => {
    const filtered = tvPackages.filter((pkg) => pkg.provider === selectedProvider);
    setAvailablePackages(filtered);
    setFormData((prev) => ({ ...prev, packageCode: "" }));
  }, [selectedProvider, tvPackages]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);

    // Add fetch POST call here to your backend if needed
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Buy TV Subscription</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">TV Provider</label>
          <select
            name="provider"
            className="w-full border rounded px-3 py-2"
            onChange={(e) => {
              setSelectedProvider(e.target.value);
              handleChange(e);
            }}
            value={formData.provider}
            required
          >
            <option value="">Select Provider</option>
            {[...new Set(tvPackages.map((pkg) => pkg.provider))].map((provider, idx) => (
              <option key={idx} value={provider}>
                {provider}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Smartcard / Decoder Number</label>
          <input
            type="text"
            name="smartcardNumber"
            className="w-full border rounded px-3 py-2"
            value={formData.smartcardNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">TV Package</label>
          <select
            name="packageCode"
            className="w-full border rounded px-3 py-2"
            onChange={handleChange}
            value={formData.packageCode}
            required
          >
            <option value="">Select Package</option>
            {availablePackages.map((pkg, idx) => (
              <option key={idx} value={pkg.code}>
                {pkg.name} - ₦{pkg.amount}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            className="w-full border rounded px-3 py-2"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Transaction PIN</label>
          <input
            type="password"
            name="pin"
            className="w-full border rounded px-3 py-2"
            value={formData.pin}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BuyTv;
