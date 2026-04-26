"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export type TabId = 'landing' | 'ship' | 'dock' | 'widgets' | 'boarding';

const tabs: { id: TabId; label: string }[] = [
  { id: 'landing', label: 'Home' },
  { id: 'ship', label: 'Ship It' },
  { id: 'dock', label: 'The Dock' },
  { id: 'boarding', label: 'Boarding' },
  { id: 'widgets', label: 'Widgets' },
];

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const handleWalletClick = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  const displayAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : null;

  return (
    <header className="px-10 py-4 border-b border-border-primary flex justify-between items-center bg-bg-header backdrop-blur-[10px] relative z-10">
      <div className="flex items-center gap-3.5">
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
      </div>

      <nav className="flex gap-1.5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-5 py-2.5 rounded-md font-mono text-[11px] cursor-pointer transition-all duration-200 tracking-[1px] ${
              activeTab === tab.id
                ? 'bg-gradient-to-br from-primary to-primary-dark text-bg-base font-bold border-none'
                : 'bg-transparent text-text-muted border border-border-primary hover:border-border-accent'
            }`}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </nav>

      <button
        onClick={handleWalletClick}
        className={`px-6 py-3 rounded-md font-mono text-[11px] font-semibold cursor-pointer tracking-[1px] transition-colors ${
          connected
            ? 'bg-primary/10 text-primary border border-primary'
            : 'bg-transparent text-primary border border-primary hover:bg-primary/10'
        }`}
      >
        {displayAddress || 'CONNECT WALLET'}
      </button>
    </header>
  );
}
