"use client";
import { use } from 'react';
import { useBoardingPool } from '../../../../hooks/useBoarding';
import BoardingDetail from '../../../../components/boarding/BoardingDetail';

export default function BoardingDetailPage({ params }: { params: Promise<{ chain: string; id: string }> }) {
  const { chain, id } = use(params);
  const { pool, loading } = useBoardingPool(id);

  if (loading) {
    return (
      <div className="text-center py-20 fade-in">
        <div className="text-2xl mb-3 animate-pulse">⛵</div>
        <div className="text-[10px] text-text-dim tracking-[2px]">LOADING POOL...</div>
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="text-center py-20 fade-in">
        <div className="text-2xl mb-3 opacity-30">🌊</div>
        <div className="text-[10px] text-text-dim tracking-[2px]">POOL NOT FOUND</div>
      </div>
    );
  }

  return <BoardingDetail pool={pool} chain={chain} />;
}
