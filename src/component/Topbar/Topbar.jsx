"use client";
import React from 'react';
import Link from 'next/link';
import {
    Menu,
    X,
} from 'lucide-react';
import { useGlobalContext } from '../Context';

const Topbar = () => {
    const {toggleMenu} = useGlobalContext();
    return (
        <div className="bg-gradient-to-r from-blue-500 to-green-400 shadow-md w-full sticky px-6 py-4 right-0 top-0 z-50 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
                Chipsub
            </Link>
            <Menu onClick={toggleMenu} size={30} />
        </div>
    )
}

export default Topbar
