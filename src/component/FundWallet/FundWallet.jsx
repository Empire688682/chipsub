import React from 'react';

const FundWallet = () => {
  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50 text-black">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Fund Your Wallet</h1>
        <p className="text-gray-600 mb-6">
          Enter the amount you want to add to your wallet. You can use your virtual account or card payment.
        </p>

        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount (₦)
            </label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              id="method"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Virtual Bank Transfer</option>
              <option>Card Payment</option>
              <option>USSD</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default FundWallet;
