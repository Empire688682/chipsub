"use client";
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../Context';
import { Wallet, Phone, Wifi, Zap, Bell, Heart, Copy, Tv } from "lucide-react";
import WalletBalance from '../WalletBalance/WalletBalance';

const Dashboard = () => {
  const { userData, getUserRealTimeData, route, transactionHistory, loading } = useGlobalContext();
  const referralLink = `https://yourdomain.com?ref=${refId} || ""}`;
console.log("userData:", userData)
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        alert("Referral link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  useEffect(() => {
    getUserRealTimeData();
  }, []);

  const fullName = userData?.name || "User";
  const firstName = fullName.split(" ")[0];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-700 font-medium text-lg">
          <Heart /> Welcome back, <span className="font-bold">{firstName}</span>
        </h2>
        <Bell className="text-gray-500 cursor-pointer" onClick={() => route.push("/notifications")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <WalletBalance />

        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm">Commission Balance</p>
          <p className="text-xl font-bold mt-2">₦0.00</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-2">Referral Link</p>
          <div className="flex items-center flex-wrap gap-2">
            <input
              value={referralLink}
              readOnly
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button onClick={handleCopy} className="ml-2 cursor-pointer bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1">
              <Copy size={16} /> Copy
            </button>
          </div>
        </div>
      </div>

      <h3 className="text-md font-medium mb-2">Quick Links</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div onClick={() => route.push("/fund-wallet")} className="bg-white cursor-pointer p-4 rounded-lg shadow-md flex items-center justify-center flex-col">
          <Wallet className="text-blue-600 mb-2" size={28} />
          <p className="text-sm font-medium">Fund Wallet</p>
        </div>

        <div onClick={() => route.push("/dashboard/buy-airtime")} className="bg-white cursor-pointer p-4 rounded-lg shadow-md flex items-center justify-center flex-col">
          <Phone className="text-blue-600 mb-2" size={28} />
          <p className="text-sm font-medium">Buy Airtime</p>
        </div>

        <div onClick={() => route.push("/dashboard/buy-data")} className="bg-white cursor-pointer p-4 rounded-lg shadow-md flex items-center justify-center flex-col">
          <Wifi className="text-blue-600 mb-2" size={28} />
          <p className="text-sm font-medium">Buy Data</p>
        </div>

        <div onClick={() => route.push("/dashboard/buy-electricity")} className="bg-white cursor-pointer p-4 rounded-lg shadow-md flex items-center justify-center flex-col">
          <Zap className="text-blue-600 mb-2" size={28} />
          <p className="text-sm font-medium">Electricity</p>
        </div>

        <div onClick={() => route.push("/dashboard/buy-tv")} className="bg-white cursor-pointer p-4 rounded-lg shadow-md flex items-center justify-center flex-col">
          <Tv className="text-blue-600 mb-2" size={28} />
          <p className="text-sm font-medium">TV Subscription</p>
        </div>
      </div>

      <h3 className="text-md font-medium mb-2 mt-6">Transaction History</h3>
      <div className="bg-white p-4 rounded-lg shadow-md">
        {
          loading ? "Loading...." :
            <div className="space-y-4">
              {
                transactionHistory.length > 0 ? (
                  <>
                    {transactionHistory.map((transaction) => (
                      <div key={transaction._id} className="flex cursor-pointer justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">{new Date(transaction.createdAt).toISOString().replace("T", " ").split(".")[0]}</p>
                          <p className="font-medium">{transaction.description}</p>
                        </div>
                        <div className='flex flex-col md:flex-row md:gap-4 justify-center'>
                          <p className={`text-sm ${transaction.status === 'success' ? 'text-green-600' : transaction.status === 'pending' ? 'text-yellow-700' : 'text-red-600'}`}>
                            {transaction.status === 'success' ? `₦${transaction.amount}` : `₦${transaction.amount}`}
                          </p>
                          <p className={`text-sm ${transaction.status === 'success' ? 'text-green-600' : transaction.status === 'pending' ? 'text-yellow-700' : 'text-red-600'}`}>
                            {transaction.type}
                          </p>
                          <p
                            className={`px-3 py-1 rounded-full text-sm font-semibold
                             ${transaction.status === 'success'
                                ? 'bg-green-100 text-green-700'
                                : transaction.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'}
                           `}
                          >
                            {transaction.status === 'success'
                              ? 'Success'
                              : transaction.status === 'pending'
                                ? 'Pending'
                                : 'Failed'}
                          </p>

                        </div>
                      </div>
                    ))}
                  </>
                ) :
                  <p className="text-gray-500 text-sm">No transaction history found.</p>
              }
            </div>
        }
      </div>
    </div>
  );
};

export default Dashboard;
