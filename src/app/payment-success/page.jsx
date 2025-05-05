"use client";
import PaymentSuccess from '@/component/PaymentSuccess/PaymentSuccess'
import React from 'react'
import { Suspense } from 'react';

const page = () => {
  return (
    <div className='flex items-center justify-center h-[90vh]'>
        <PaymentSuccess />
    </div>
  )
}

export default page
