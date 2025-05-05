"use client";
import LoadingSpinner from '@/component/LoadingSpinner/LoadingSpinner';
import PaymentSuccess from '@/component/PaymentSuccess/PaymentSuccess'
import React from 'react'
import { Suspense } from 'react';

const page = () => {
  return (
    <div className='flex items-center justify-center h-[90vh]'>
        <Suspense fallback={<div><LoadingSpinner /></div>}>
        <PaymentSuccess />
        </Suspense>
    </div>
  )
}

export default page
