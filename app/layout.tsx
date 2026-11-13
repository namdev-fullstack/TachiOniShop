import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MaintenancePage from '@/components/MaintenancePage';
import SiteLayoutWrapper from '@/components/SiteLayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Dịch vụ hỗ trợ nâng cấp Acc',
  icons: {
    icon: '/logo-metadata.png',
    shortcut: '/logo-metadata.png',
    apple: '/logo-metadata.png',
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
