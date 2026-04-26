import type { Metadata } from 'next';
import WalletProvider from '../providers/WalletProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'THE SHIPYARD | We Ship Widgets',
  description: 'Zero dev extraction. Locked LP forever. Auto-compounding fees. Build vessels that can\'t sink.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
