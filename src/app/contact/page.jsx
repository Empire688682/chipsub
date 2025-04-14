import Contact from '@/component/Contact/Contact';
import React from 'react';

const Page = () => {
  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-blue-50 to-white text-black">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-8">
          Need help, feedback, or partnership? Fill out the form below and we’ll get back to you as soon as possible.
        </p>
        <Contact />
      </div>
    </div>
  );
};

export default Page;
