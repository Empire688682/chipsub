"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentRef = searchParams.get("paymentReference");

      if (!paymentRef) {
        return setStatus("Invalid request. No reference provided.");
      }

      try {
        const res = await axios.post("/api/verify-payment", {
          paymentReference: paymentRef,
        });

        if (res.data.success) {
          setStatus("✅ Payment successful!");
        } else {
          setStatus("❌ Payment failed or not verified.");
        }
      } catch (err) {
        setStatus("⚠️ Error verifying payment.");
        console.error(err);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-center">{status}</h1>
    </div>
  );
};

export default PaymentSuccess;
