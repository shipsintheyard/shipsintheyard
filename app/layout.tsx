import type { Metadata } from 'next';
import ChainProvider from '../providers/ChainProvider';
import WalletProvider from '../providers/WalletProvider';
import EVMProvider from '../providers/EVMProvider';
import Stars from '../components/Stars';
import Header from '../components/Header';
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
        <ChainProvider>
          <WalletProvider>
            <EVMProvider>
              <div className="min-h-screen bg-[linear-gradient(180deg,#0f1419_0%,#1a1f2e_50%,#0f1419_100%)] text-text-body font-mono">
                <Stars />
                <Header />

                <main>
                  {children}
                </main>

                <footer className="px-10 py-9 border-t border-[rgba(136,192,255,0.1)] flex justify-between items-center">
                  <div className="text-[11px] text-text-dim">&copy; 2026 THE SHIPYARD. We ship widgets.</div>
                  <div className="flex gap-5">
                    {['Twitter', 'Docs', 'GitHub'].map(link => (
                      <a key={link} href="#" className="text-[11px] text-text-muted no-underline hover:text-primary transition-colors">
                        {link}
                      </a>
                    ))}
                  </div>
                </footer>
              </div>
            </EVMProvider>
          </WalletProvider>
        </ChainProvider>
      </body>
    </html>
  );
}
