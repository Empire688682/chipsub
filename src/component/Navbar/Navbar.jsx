'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md px-6 py-4 fixed w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          #Chipsub
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link href="/buy-data" className="text-gray-600 hover:text-blue-600">Buy Data</Link>
          <Link href="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={toggleMenu} className="md:hidden">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 bg-white shadow-lg px-4 py-2">
          <Link href="/" className="block text-gray-600 hover:text-blue-600">Home</Link>
          <Link href="/buy-data" className="block text-gray-600 hover:text-blue-600">Buy Data</Link>
          <Link href="/pricing" className="block text-gray-600 hover:text-blue-600">Pricing</Link>
          <Link href="/contact" className="block text-gray-600 hover:text-blue-600">Contact</Link>
        </div>
      )}
    </nav>
  );
}
