import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const DownloadOurApp = () => {
  return (
    <div className="min-h-screen px-6 py-16 bg-white text-black flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Get the Chipsub App</h1>
        <p className="text-gray-700 mb-8 text-lg">
          Download our mobile app for the fastest way to buy data, airtime, recharge PINs and more!
        </p>

        <div className="flex justify-center items-center gap-4 mb-10 flex-wrap">
          {/* Android */}
          <Link href="https://play.google.com/store" target="_blank" className="bg-black text-white rounded-xl hover:bg-gray-800">
          <Image src="/google-playstore.png" alt="Apple" width={170} height={24} />
          </Link>

          {/* iOS */}
          <Link href="https://www.apple.com/app-store/" target="_blank" className="rounded-xl">
            <Image src="/apple-store.png" alt="Apple" width={200} height={24} />
          </Link>
        </div>

        <Image
          src="/chipsub-app-prev.png"
          alt="App Preview"
          width={500}
          height={500}
          className="mx-auto rounded-xl shadow-md"
        />
      </div>
    </div>
  );
};

export default DownloadOurApp;
