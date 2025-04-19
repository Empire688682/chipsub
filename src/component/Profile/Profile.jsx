'use client';
import React, { useState } from 'react';
import { LogOut, ShieldAlert, ShieldCheck, Bell, Moon, History, Pencil } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { useGlobalContext } from '../Context';

const Profile = () => {
  const [notify, setNotify] = useState(true);
  const { userData, logoutUser, setPinModal } = useGlobalContext();

  const user = {
    name: `${userData.name}`|| "",
    email: `${userData.email}` || "",
    phone: `${userData.phone}` || "",
    bvnVerified: userData.bvnVerify,
    avatar: '/profile-img.png',
    transactions: [
      { id: 1, type: 'Airtime Purchase', amount: '₦500', date: '2025-04-16' },
      { id: 2, type: 'Electricity', amount: '₦2000', date: '2025-04-14' },
      { id: 3, type: 'Data Bundle', amount: '₦1000', date: '2025-04-12' },
    ],
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    toast.success('Password updated!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <ToastContainer />
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Left: Profile Overview */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-blue-100 flex flex-col items-center text-center">
          <div className="relative w-25 h-25 rounded-full overflow-hidden shadow-lg mb-4">
            <Image
              src={user.avatar}
              alt="Profile"
              fill
              style={{objectFit:"cover"}}
            />
          </div>
          <h2 className="text-xl font-bold text-blue-700">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-600">{user.phone}</p>

          <div className="mt-3">
            {user.bvnVerified ? (
              <span className="text-green-600 flex items-center justify-center gap-2 text-sm">
                <ShieldCheck size={16} /> BVN Verified
              </span>
            ) : (
              <div className="text-red-500 flex flex-col items-center gap-1 text-sm">
                <span className="flex items-center gap-1">
                  <ShieldAlert size={16} /> BVN Not Verified
                </span>
                <button
                  onClick={() => toast.info('Redirecting to BVN verification...')}
                  className="bg-yellow-400 mt-2 px-3 py-1 rounded-md text-xs text-black hover:bg-yellow-500"
                >
                  Verify Now
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3 w-full">
            <button
              onClick={logoutUser}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            >
              <LogOut size={16} /> Logout
            </button>

            <button
              onClick={()=>setPinModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              <Pencil size={16} /> Set Pin
            </button>
          </div>
        </div>

        {/* Middle: Settings & Change Password */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Settings</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 text-sm text-gray-700"><Bell size={18} /> Notifications</span>
              <input
                type="checkbox"
                checked={notify}
                onChange={() => setNotify(!notify)}
                className="toggle toggle-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-gray-700"><Moon size={18} /> Dark Mode</span>
              <button className="bg-gray-100 px-2 py-1 rounded text-xs" disabled>Coming soon</button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* Right: Transaction History */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
            <History size={20} /> Transaction History
          </h3>
          <ul className="space-y-3 text-sm text-gray-700 max-h-72 overflow-y-auto">
            {user.transactions.map((tx) => (
              <li key={tx.id} className="border-b pb-2">
                <p className="font-medium">{tx.type}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{tx.amount}</span>
                  <span>{tx.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
