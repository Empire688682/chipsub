"use client";
import CTA from '@/component/CTA/CTA';
import DownloadOurApp from '@/component/DownloadOurApp/DownloadOurApp';
import Hero from '@/component/Hero/Hero';
import HowItWorks from '@/component/HowItWork/HowItWork';
import PricingSec from '@/component/PricingSec/PricingSec';
import Services from '@/component/Services/Services';
import Testimonials from '@/component/Testimonials/Testimonials';
import WhyChooseUs from '@/component/WhyChooseUs/WhyChooseUs';
import React, { useEffect } from 'react';

const Page = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const refId = searchParams.get("ref");

      if (refId) {
        const expireIn = Date.now() + 3 * 24 * 60 * 60 * 1000; // 3 days
        localStorage.setItem(
          "ReferralID",
          JSON.stringify({ refId, expireIn })
        );
        console.log("Referral ID saved:", refId); // For debugging
      }
    }
  }, []);

  return (
    <div>
      <Hero />
      <HowItWorks />
      <Services />
      <WhyChooseUs />
      <PricingSec />
      <Testimonials />
      <CTA />
      <DownloadOurApp />
    </div>
  );
};

export default Page;
