// app/ClientWrapper.js
"use client";

import Sidebar from "@/component/Sidebar/Sidebar";
import { AppProvider } from "@/component/Context";
import Footer from "@/component/Footer/Footer";
import Topbar from "@/component/Topbar/Topbar";
import { SessionProvider } from "next-auth/react";

export default function ClientWrapper({ children }) {
  return (
    <AppProvider>
      <div className="flex items-center bg-white shadow-md justify-start w-full">
        <Sidebar />
        <div className="w-full">
          <Topbar />
          <SessionProvider>
            {children}
          </SessionProvider>
        </div>
      </div>
      <Footer />
    </AppProvider>
  );
}