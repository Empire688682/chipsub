"use client";
import PaymentSuccess from '@/component/PaymentSuccess/PaymentSuccess'
import React from 'react'
import { Suspense } from 'react';

const page = () => {
  return (
    <div className='flex items-center justify-center min-h-[60vh]'>
        <Suspense fallback={<div>Verifying payment........</div>}>
      <PaymentSuccess />
    </Suspense>
    </div>
  )
}

export default page
