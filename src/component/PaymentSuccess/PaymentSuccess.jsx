"useclient";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PaymentSuccess() {
  const router = useRouter();
  const { transaction_id } = router.query;
  const [status, setStatus] = useState('Verifying payment...');

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md text-center max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800">{status}</h2>
      </div>
    </div>
  );
}