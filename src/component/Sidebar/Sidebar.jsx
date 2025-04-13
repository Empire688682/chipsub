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
} from 'lucide-react';
import { useGlobalContext } from '../Context';

export default function Sidebar() {
  const { isOpen } = useGlobalContext();

  return (
    <nav
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 px-6 py-10 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <Home size={18} className="hidden md:block" />
          Home
        </Link>
        <Link href="/buy-data" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <Wifi size={18} className="hidden md:block" />
          Buy Data
        </Link>
        <Link href="/pricing" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <DollarSign size={18} className="hidden md:block" />
          Pricing
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <LayoutDashboard size={18} className="hidden md:block" />
          Dashboard
        </Link>
        <Link href="/api-docs" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <FileCode size={18} className="hidden md:block" />
          API Docs
        </Link>
        <Link href="/fund-wallet" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <Wallet size={18} className="hidden md:block" />
          Fund Wallet
        </Link>
        <Link href="/contact" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <Phone size={18} className="hidden md:block" />
          Contact
        </Link>
        <Link href="/blog" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <Newspaper size={18} className="hidden md:block" />
          Blog
        </Link>
      </div>
    </nav>
  );
}
