import Sidebar from "@/component/Sidebar/Sidebar";
import "./globals.css";
import { AppProvider } from "@/component/Context";
import Footer from "@/component/Footer/Footer";
import Topbar from "@/component/Topbar/Topbar";
import Script from "next/script";

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
          {/* Tawk.to Live Chat Script */}
          <Script
            id="tawk-to-live-chat"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
                (function(){
                  var s1 = document.createElement("script"),
                      s0 = document.getElementsByTagName("script")[0];
                  s1.async = true;
                  s1.src = 'https://embed.tawk.to/681cca35fd6aa2190e6ef074/1iqo7bolo';
                  s1.charset = 'UTF-8';
                  s1.setAttribute('crossorigin','*');
                  s0.parentNode.insertBefore(s1, s0);
                })();
              `,
            }}
          />

          <div className="flex items-center bg-white shadow-md justify-start w-full">
            <Sidebar />
            <div className="w-full">
              <Topbar />
              {children}
            </div>
          </div>

          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
