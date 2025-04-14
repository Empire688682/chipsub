import React from 'react';

const Dashboard = () => {
  const walletBalance = 3500.75; // Replace with actual fetched balance

  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Welcome Back 👋</h1>

        {/* Wallet Balance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Wallet Balance</h2>
          <p className="text-3xl font-bold text-green-600">
            ₦{walletBalance.toLocaleString()}
          </p>
        </div>

        {/* You can add more sections like transaction history or quick actions here */}
      </div>
    </div>
  );
};

export default Dashboard;
