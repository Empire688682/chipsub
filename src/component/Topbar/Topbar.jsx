import React from 'react';
import {
    Menu,
    X,
  } from 'lucide-react';

const Topbar = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-green-400 shadow-md w-full sticky px-6 py-4 right-0 top-0 z-50 flex items-center justify-end">
      <Menu size={30} />
    </div>
  )
}

export default Topbar
