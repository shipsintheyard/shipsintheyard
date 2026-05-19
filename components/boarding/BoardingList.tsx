"use client";
import { useState } from 'react';
import { type BoardingPool } from '../../hooks/useBoarding';
import BoardingCard from './BoardingCard';

type StatusFilter = 'all' | 'active' | 'succeeded' | 'failed' | 'launched';
type ChainFilter = 'all' | 'sol' | 'base';

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'ALL' },
  { id: 'active', label: 'LIVE' },
  { id: 'succeeded', label: 'FUNDED' },
  { id: 'launched', label: 'LAUNCHED' },
  { id: 'failed', label: 'FAILED' },
];

const CHAIN_FILTERS: { id: ChainFilter; label: string }[] = [
  { id: 'all', label: 'ALL' },
  { id: 'sol', label: 'SOL' },
  { id: 'base', label: 'BASE' },
];

interface BoardingListProps {
  pools: BoardingPool[];
  loading: boolean;
}

export default function BoardingList({ pools, loading }: BoardingListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [chainFilter, setChainFilter] = useState<ChainFilter>('all');

  const filtered = pools.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (chainFilter !== 'all' && p.chain !== chainFilter) return false;
    return true;
  });

  return (
    <div className="fade-in">
      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex gap-1.5">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-4 py-2 rounded-md text-[10px] font-mono tracking-[1px] transition-all duration-200 ${
                statusFilter === f.id
                  ? 'bg-primary/12 text-primary border border-primary/30'
                  : 'bg-transparent text-text-dim border border-transparent hover:text-text-muted'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-border-primary" />

        <div className="flex gap-1">
          {CHAIN_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setChainFilter(f.id)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-mono tracking-[1px] transition-all duration-200 ${
                chainFilter === f.id
                  ? 'bg-primary/12 text-primary border border-primary/30'
                  : 'bg-transparent text-text-dim border border-transparent hover:text-text-muted'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 fade-in">
          <div className="text-2xl mb-3 animate-pulse">⛵</div>
          <div className="text-[10px] text-text-dim tracking-[2px]">LOADING POOLS...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 fade-in">
          <div className="text-2xl mb-3 opacity-30">🌊</div>
          <div className="text-[10px] text-text-dim tracking-[2px]">NO POOLS FOUND</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {filtered.map(pool => (
            <BoardingCard key={`${pool.chain}-${pool.publicKey}`} pool={pool} />
          ))}
        </div>
      )}
    </div>
  );
}
