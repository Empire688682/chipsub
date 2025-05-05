'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGlobalContext } from '../Context';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const transaction_id = searchParams.get('transaction_id');
  const [status, setStatus] = useState('Verifying payment...');
  const {route} = useGlobalContext();

  useEffect(() => {
    if (transaction_id) {
      fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transaction_id }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStatus('✅ Payment verified successfully!');
          } else {
            setStatus('❌ Verification failed');
          }
        })
        .catch(() => setStatus('❌ Error verifying payment'));
    }
  }, [transaction_id]);

  return (
    <div className="flex items-center justify-center gap-6 flex-col">
      <div className="bg-white p-6 rounded-2xl shadow-md text-center max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800">{status}</h2>
        <p>Transaction ID: {transaction_id}</p>
      </div>
      <button onClick={()=>route.push("/dashboard")} className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition'>To Dashboard</button>
    </div>
  );
}
