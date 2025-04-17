'use client';

import Link from 'next/link';
import {
  Home,
  Wifi,
  DollarSign,
  LayoutDashboard,
  FileCode,
  Wallet,
  Phone,
  Newspaper,
  LogOut 
} from 'lucide-react';
import { useGlobalContext } from '../Context';

export default function Sidebar() {
  const { isOpen, setIsOpen, logoutUser} = useGlobalContext();

  return (
    <nav
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md pt-4 z-50 px-6 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <Link onClick={()=>setIsOpen(false)} href="/" className="text-2xl font-bold text-blue-600" onClick={()=>setIsOpen(false)}>
        Chipsub
      </Link>
      <div className="flex flex-col gap-6 pt-6">
        <Link onClick={()=>setIsOpen(false)} href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <Home size={18} className="hidden md:block" />
          Home
        </Link>
        <Link onClick={()=>setIsOpen(false)} href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <Wifi size={18} className="hidden md:block" />
          Buy Data
        </Link>
        <Link onClick={()=>setIsOpen(false)} href="/profile" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <DollarSign size={18} className="hidden md:block" />
          Profile
        </Link>
        <Link onClick={()=>setIsOpen(false)} href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <LayoutDashboard size={18} className="hidden md:block" />
          Dashboard
        </Link>
        <Link onClick={()=>setIsOpen(false)} href="/api-docs" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <FileCode size={18} className="hidden md:block" />
          API Docs
        </Link>
        <Link onClick={()=>setIsOpen(false)} href="/fund-wallet" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <Wallet size={18} className="hidden md:block" />
          Fund Wallet
        </Link>
        <Link onClick={()=>setIsOpen(false)} href="/contact" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <Phone size={18} className="hidden md:block" />
          Contact
        </Link>
        <Link onClick={()=>setIsOpen(false)} href="/blog" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <Newspaper size={18} className="hidden md:block" />
          Blog
        </Link>
        <div onClick={logoutUser} className="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-blue-600">
          <LogOut  size={18} className="hidden md:block" />
          Logout
        </div>
      </div>
    </nav>
  );
}
