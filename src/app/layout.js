import Sidebar from "@/component/Sidebar/Sidebar";
import "./globals.css";
import { AppProvider } from "@/component/Context";
import Footer from "@/component/Footer/Footer";
import Topbar from "@/component/Topbar/Topbar";
import { Toaster } from 'react-hot-toast';


export const metadata = {
  title: "ChipSub",
  description: "This is ChipSub website",
  author: "Jayempire",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <div className="flex min-h-screen bg-white shadow-md justify-start w-full">
            <Sidebar />
            <div className="min-h-screen w-full">
               <Topbar />
               <Toaster position="top-right" />
              {children}
            </div>
          </div>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
