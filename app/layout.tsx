import Header from '@/components/header';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from '@/components/footer';
import { Toaster } from 'sonner';

import ScrollToTop from '@/components/ScrollToTop';
import MaintenancePage from '@/components/MaintenancePage';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mua Bán Tài Khoản Game Uy Tín #1 Việt Nam',
  description: 'Nền tảng mua bán tài khoản game hàng đầu Việt Nam...',
  icons: {
    icon: "/avatar2-removebg.PNG", // favicon chính
    shortcut: "/avatar2-removebg.PNG",
    apple: "/avatar2-removebg.PNG", // cho iOS
  },
  // phần metadata khác của bạn giữ nguyên
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMaintenance = process.env.MAINTENANCE_MODE === "false";

  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {isMaintenance ? (
          <MaintenancePage />
        ) : (
        <>
            <ScrollToTop />
            <Header />
            {children}
            <Footer />
            <Toaster richColors position="bottom-right" />
        </>
         
        )}
      </body>
    </html>
  );
}
