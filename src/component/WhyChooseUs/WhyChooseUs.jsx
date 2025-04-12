import {
    CheckCircle,
    Zap,
    ShieldCheck,
    Clock4,
    Users,
  } from 'lucide-react';
  
  export default function WhyChooseUs() {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Choose Chipsub?
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            We're not just another VTU platform — we offer speed, savings, and support you can trust.
          </p>
  
          <div className="grid md:grid-cols-3 gap-10 text-left">
            <BenefitCard
              Icon={Zap}
              title="Fast Delivery"
              description="Get data and airtime delivered instantly — no delays, no excuses."
            />
            <BenefitCard
              Icon={CheckCircle}
              title="Best Prices"
              description="We offer the cheapest rates with no hidden charges."
            />
            <BenefitCard
              Icon={ShieldCheck}
              title="Secure Platform"
              description="Your transactions are protected with industry-grade encryption."
            />
            <BenefitCard
              Icon={Clock4}
              title="24/7 Availability"
              description="We never sleep. Buy anytime — day or night."
            />
            <BenefitCard
              Icon={Users}
              title="Referral Bonuses"
              description="Invite friends and earn rewards or free data — just for sharing."
            />
          </div>
        </div>
      </section>
    );
  }
  
  function BenefitCard({ Icon, title, description }) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
        <div className="flex items-center mb-4 text-blue-600">
          <Icon size={28} className="mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    );
  }
  