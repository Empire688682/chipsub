import CTA from '@/component/CTA/CTA'
import Hero from '@/component/Hero/Hero'
import HowItWorks from '@/component/HowItWork/HowItWork'
import PricingSec from '@/component/PricingSec/PricingSec'
import Services from '@/component/Services/Services'
import Testimonials from '@/component/Testimonials/Testimonials'
import WhyChooseUs from '@/component/WhyChooseUs/WhyChooseUs'
import React from 'react'

const page = () => {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <Services />
      <WhyChooseUs />
      <PricingSec />
      <Testimonials />
      <CTA />
    </div>
  )
}

export default page
