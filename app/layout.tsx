import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MaintenancePage from '@/components/MaintenancePage';
import SiteLayoutWrapper from '@/components/SiteLayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dịch vụ cho thuê tài khoản game uy tín',
  description: 'Nền tảng hỗ trợ và cho thuê tài khoản game hàng đầu...',
  icons: {
    icon: "/avatar2-removebg.PNG",
    shortcut: "/avatar2-removebg.PNG",
    apple: "/avatar2-removebg.PNG",
  },
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
          <SiteLayoutWrapper>{children}</SiteLayoutWrapper>
        )}
      </body>
    </html>
  );
}
