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
    const { toggleMenu, isModalOpen, openModal, userData, route } = useGlobalContext();
    const pathName = usePathname();

    const isHomePage = pathName === '/';
    const isProfile = pathName === '/profile';
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
                    isHomePage && !userData && (
                        <div className='flex gap-3'>
                            <button className='cursor-pointer text-white font-semibold' onClick={() => openModal("login")}>Login</button>
                            <button className='cursor-pointer text-white font-semibold' onClick={() => openModal("register")}>Register</button>
                        </div>
                    )
                }
                {
                    userData && isHomePage && (
                        <Image src="/profile-img.png" alt="profile" width={35} height={50} className="rounded-full cursor-pointer" onClick={()=>route.push("/dashboard")}/>
                    )
                }
                {
                    userData && !isHomePage && !isProfile && (
                        <Image onClick={()=>route.push("/profile")} src="/profile-img.png" alt="profile" width={35} height={50} className="rounded-full cursor-pointer"/>
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
