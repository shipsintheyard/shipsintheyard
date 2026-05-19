"use client";
import { useChain } from '../providers/ChainProvider';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function WalletButton() {
  const { chain } = useChain();

  if (chain === 'sol') return <SolanaWalletButton />;
  return <EVMWalletButton />;
}

function SolanaWalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connected) disconnect();
    else setVisible(true);
  };

  const displayAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : null;

  return (
    <button
      onClick={handleClick}
      className={`px-6 py-3 rounded-md font-mono text-[11px] font-semibold cursor-pointer tracking-[1px] transition-colors ${
        connected
          ? 'bg-primary/10 text-primary border border-primary'
          : 'bg-transparent text-primary border border-primary hover:bg-primary/10'
      }`}
    >
      {displayAddress || 'CONNECT WALLET'}
    </button>
  );
}

function EVMWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      // Prefer injected (MetaMask), fall back to first available
      const connector = connectors.find(c => c.id === 'injected') || connectors[0];
      if (connector) connect({ connector });
    }
  };

  const displayAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : null;

  return (
    <button
      onClick={handleClick}
      className={`px-6 py-3 rounded-md font-mono text-[11px] font-semibold cursor-pointer tracking-[1px] transition-colors ${
        isConnected
          ? 'bg-primary/10 text-primary border border-primary'
          : 'bg-transparent text-primary border border-primary hover:bg-primary/10'
      }`}
    >
      {displayAddress || 'CONNECT WALLET'}
    </button>
  );
}
