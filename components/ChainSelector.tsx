"use client";
import { useChain, type Chain } from '../providers/ChainProvider';

const chains: { id: Chain; label: string }[] = [
  { id: 'sol', label: 'SOL' },
  { id: 'base', label: 'BASE' },
];

export default function ChainSelector() {
  const { chain, setChain } = useChain();

  return (
    <div className="flex bg-bg-input rounded-md border border-border-primary overflow-hidden">
      {chains.map(c => (
        <button
          key={c.id}
          onClick={() => setChain(c.id)}
          className={`px-3 py-1.5 text-[10px] font-mono tracking-[1px] transition-all duration-200 ${
            chain === c.id
              ? 'bg-primary/15 text-primary font-semibold'
              : 'text-text-dim hover:text-text-muted'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
