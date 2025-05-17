import DashboardLayout from '@/component/Dashboard/Dashboard'
import React from 'react'

const Page = () => {
  return (
    <div className='px-6 py-10 bg-gradient-to-br from-blue-50 to-white'>
      <div className="overflow-hidden mb-6 whitespace-nowrap bg-white p-2 rounded-lg shadow">
        <div className="animate-scroll text-sm text-gray-700 inline-block">
          👥 Active Users: 1,249 &nbsp;·&nbsp;
          📱 Airtime Purchases : 78 &nbsp;·&nbsp;
          📶 Data Purchases: 55 &nbsp;·&nbsp;
          📺 TV Subscriptions: 34 &nbsp;·&nbsp;
          ⚡ Electricity Tokens: 29 &nbsp;·&nbsp;
          💰 Wallet Fundings: ₦45,000 &nbsp;·&nbsp;
          🎁 Commissions Paid: ₦800
        </div>
      </div>
      <DashboardLayout />
    </div>
  )
}

export default Page
