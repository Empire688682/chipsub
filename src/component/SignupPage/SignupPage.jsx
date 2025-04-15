'use client';

import { FcGoogle } from 'react-icons/fc';
import { X } from 'lucide-react';
import { useGlobalContext } from '../Context';

export default function SignupPage() {
    const {
        isModalOpen, 
        setIsModalOpen,
        authType, 
        openModal} = useGlobalContext();

  return (
    <div className="min-h-screen absolute w-full flex items-center justify-center text-black px-4">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-70">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              {authType === 'register' ? 'Create Account' : 'Login to Chipsub'}
            </h2>

            <form className="space-y-4">
              {authType === 'register' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border rounded-lg outline-none border-gray-500 px-4 py-2"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded-lg outline-none border-gray-500 px-4 py-2"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded-lg outline-none border-gray-500 px-4 py-2"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                {authType === 'register' ? 'Register' : 'Login'}
              </button>
              {
                authType === 'register' && <p className='text-center'>Already have an account? <span onClick={()=>openModal("login")} className='text-blue-600 underline cursor-pointer'>Login</span></p>
              }
            </form>

            <div className="mt-6 flex items-center justify-between">
              <hr className="w-full border-t border-gray-500" />
              <span className="mx-2 text-gray-400 text-sm">OR</span>
              <hr className="w-full border-t border-gray-500" />
            </div>

            <button className="w-full mt-4 flex items-center justify-center gap-3 border border-gray-500 py-2 rounded-lg hover:bg-gray-100">
              <FcGoogle size={22} />
              <span className="text-sm">Continue with Google</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
