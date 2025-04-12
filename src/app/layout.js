import Navbar from "@/component/Navbar/Navbar";
import "./globals.css";
import { AppProvider } from "@/component/Context";

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
          <Navbar />
          <div className="min-h-screen pt-20 px-6 md:px-9">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
