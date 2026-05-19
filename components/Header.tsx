"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ChainSelector from './ChainSelector';
import WalletButton from './WalletButton';

const tabs = [
  { href: '/', label: 'Home' },
  { href: '/ship', label: 'Ship It' },
  { href: '/dock', label: 'The Dock' },
  { href: '/boarding', label: 'Boarding' },
  { href: '/widgets', label: 'Widgets' },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="px-10 py-4 border-b border-border-primary flex justify-between items-center bg-bg-header backdrop-blur-[10px] relative z-10">
      <Link href="/" className="flex items-center gap-3.5 no-underline">
        <div className="w-[42px] h-[42px] bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center text-[22px] shadow-[0_4px_20px_rgba(136,192,255,0.3)]">
          ⛵
        </div>
        <div>
          <div className="font-heading text-xl font-bold tracking-[1px] text-white">
            THE SHIPYARD
          </div>
          <div className="text-[9px] text-primary tracking-[3px]">
            WE SHIP WIDGETS
          </div>
        </div>
      </Link>

      <nav className="flex gap-1.5">
        {tabs.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-5 py-2.5 rounded-md font-mono text-[11px] no-underline transition-all duration-200 tracking-[1px] ${
              isActive(tab.href)
                ? 'bg-gradient-to-br from-primary to-primary-dark text-bg-base font-bold border-none'
                : 'bg-transparent text-text-muted border border-border-primary hover:border-border-accent'
            }`}
          >
            {tab.label.toUpperCase()}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <ChainSelector />
        <WalletButton />
      </div>
    </header>
  );
}
