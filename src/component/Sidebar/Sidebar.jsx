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

export default function Sidebar() {

  return (
    <nav className="bg-white shadow-md fixed pl-6 pr-16 py-4 left-0 top-0 h-full z-50">
      {/* Logo */}
      <div className="mb-4 border-b pb-4">
      <Link href="/" className="text-2xl font-bold text-blue-600">
          Chipsub
        </Link>
      </div>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
        <Home size={18} className='hidden md:block' />
        Home
      </Link>
      <Link href="/buy-data" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
        <Wifi size={18} className='hidden md:block' />
        Buy Data
      </Link>
      <Link href="/pricing" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
        <DollarSign size={18} className='hidden md:block' />
        Pricing
      </Link>
      <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
        <LayoutDashboard size={18} className='hidden md:block' />
        Dashboard
      </Link>
      <Link href="/api-docs" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
        <FileCode size={18} className='hidden md:block' />
        API Docs
      </Link>
      <Link href="/fund-wallet" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
        <Wallet size={18} className='hidden md:block' />
        Fund Wallet
      </Link>
      <Link href="/contact" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
        <Phone size={18} className='hidden md:block' />
        Contact
      </Link>
      <Link href="/blog" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
        <Newspaper size={18} className='hidden md:block' />
        Blog
      </Link>
        </div>
      </div>
    </nav>
  );
}
