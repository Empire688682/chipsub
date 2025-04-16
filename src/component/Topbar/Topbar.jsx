"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
    Menu,
    X,
} from 'lucide-react';
import { useGlobalContext } from '../Context';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import SignupPage from '../SignupPage/SignupPage';

const Topbar = () => {
    const { toggleMenu, isModalOpen, openModal } = useGlobalContext();
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const pathName = usePathname();

    const isHomePage = pathName === '/';
    return (
        <div className="bg-gradient-to-r relative from-blue-500 to-green-400 shadow-md w-full sticky px-6 py-4 right-0 top-0 z-10 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
                Chipsub
            </Link>
           <div className='md:block hidden'>
           {
                isHomePage && (
                    <a href='#downloadApp' className='text-white'>
                        Download App
                    </a>
                )
            }
           </div>
            <div className='flex items-center gap-4'>
                {
                    isHomePage ? (
                        <div className='flex gap-3'>
                            <button className='cursor-pointer text-white font-semibold' onClick={() => openModal("login")}>Login</button>
                            <button className='cursor-pointer text-white font-semibold' onClick={() => openModal("register")}>Register</button>
                        </div>
                    ) : (
                        <div>
                            {
                                isAuthenticated ? (
                                    <Image src="/profile.svg" alt="profile" width={30} height={30} className="rounded-full cursor-pointer" />
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <Link href="/login" className="text-white md:text-base text-sm hover:underline">Login</Link>
                                        <Link href="/register" className="text-white md:text-base text-sm hover:underline">Sign Up</Link>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
                {
                    !isHomePage && <Menu onClick={toggleMenu} size={30} className='cursor-pointer' />
                }
            </div>
            {
                isModalOpen && (<SignupPage />)
            }
        </div>
    )
}

export default Topbar
