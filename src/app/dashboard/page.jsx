"use client";
import Dashboard from '@/component/Dashboard/Dashboard'
import React, { useState, useEffect } from 'react'
import axios from "axios"
import { useGlobalContext } from '@/component/Context';
import LoadingSpinner from '@/component/LoadingSpinner/LoadingSpinner';

const Page = () => {
  const { userData, route } = useGlobalContext();
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const response = await axios.get("/api/all-data");
      if (response.data.success) {
        setAllData(response.data.data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
    }, 180000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userData === null) return; // Wait for context to load

    if (!userData) {
      route.push('/'); // Or wherever you want to send unauthenticated users
    } else {
      fetchAllData();
      setLoading(false);
    }
  }, [userData]); // ✅ Re-run when userData updates


  return (
    <>
      {
        loading ? <LoadingSpinner />
          :
          <div className='px-6 py-10 bg-gradient-to-br from-blue-50 to-white'>
            <div className="overflow-hidden w-full mb-6 whitespace-nowrap bg-white p-2 rounded-lg shadow">
              <div className="animate-scroll text-sm text-gray-700 inline-block">
                👥 Active Users: {allData.users} &nbsp;·&nbsp;
                📱 Airtime Purchases : {allData.airtime} &nbsp;·&nbsp;
                📶 Data Purchases: {allData.data} &nbsp;·&nbsp;
                📺 TV Subscriptions: {allData.tv} &nbsp;·&nbsp;
                ⚡ Electricity Tokens: {allData.electricity} &nbsp;·&nbsp;
                💰 Wallet Fundings: ₦{allData.walletsTotal} &nbsp;·&nbsp;
                🎁 Commissions Paid: ₦{allData.totalReward}
              </div>
            </div>
            <Dashboard />
          </div>
      }
    </>
  )
}

export default Page
