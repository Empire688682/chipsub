"use client";
import DashboardLayout from '@/component/Dashboard/Dashboard'
import React, { useState, useEffect } from 'react'
import axios from "axios"

const Page = () => {

   const [allData, setAllData] = useState({});
    const fetchAllData = async () =>{
      try {
        const response = await axios.get("/api/all-data");
        if(response.data.success){
          setAllData(response.data.data);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };
  
    useEffect(()=>{
  
      const interval = setInterval(()=>{
        fetchAllData();
      },180000);
  
      return ()=> clearInterval(interval);
    }, []);

    useEffect(()=>{
      fetchAllData();
    }, []);

  return (
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
      <DashboardLayout />
    </div>
  )
}

export default Page
