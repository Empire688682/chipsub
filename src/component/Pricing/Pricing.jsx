import React from 'react';

const plans = [
  {
    network: 'MTN',
    price: '₦500',
    data: '1GB',
    validity: '30 Days',
  },
  {
    network: 'GLO',
    price: '₦900',
    data: '2GB',
    validity: '30 Days',
  },
  {
    network: 'Airtel',
    price: '₦2200',
    data: '5GB',
    validity: '30 Days',
  },
  {
    network: '9Mobile',
    price: '₦4300',
    data: '10GB',
    validity: '30 Days',
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-blue-50 to-white text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">
          Affordable Data Plans
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition duration-300"
            >
              <h2 className="text-xl font-bold text-blue-600">{plan.network}</h2>
              <p className="text-gray-600 mt-2">{plan.data}</p>
              <p className="text-gray-800 font-semibold text-lg mt-2">{plan.price}</p>
              <p className="text-sm text-gray-500 mt-1">Validity: {plan.validity}</p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
