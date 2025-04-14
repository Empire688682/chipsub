"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
    Menu,
    X,
} from 'lucide-react';
import { useGlobalContext } from '../Context';
import Image from 'next/image';

const Topbar = () => {
    const { toggleMenu } = useGlobalContext();
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    return (
        <div className="bg-gradient-to-r from-blue-500 to-green-400 shadow-md w-full sticky px-6 py-4 right-0 top-0 z-10 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
                Chipsub
            </Link>
            <div className='flex items-center gap-4'>
                {
                    isAuthenticated ? (
                        <Image src="/profile.svg" alt="profile" width={30} height={30} className="rounded-full cursor-pointer" />
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-white hover:underline">Login</Link>
                            <Link href="/register" className="text-white hover:underline">Sign Up</Link>
                        </div>
                    )
                }
                <Menu onClick={toggleMenu} size={30} className='cursor-pointer' />
            </div>
        </div>
    )
}

export default Topbar
