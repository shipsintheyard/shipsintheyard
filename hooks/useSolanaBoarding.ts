"use client";
import { useState, useEffect } from 'react';
import { getReadOnlyProgram } from '../lib/solana';
import type { BoardingPool, PoolStatus, BoardingMode, AccessMode } from './useBoarding';

function deriveModeFromDeadline(deadline: number, _now?: number): BoardingMode {
  // We can't know the original duration from on-chain data alone,
  // so we approximate: if <1h window, blitz; if <12h, flash; else voyage
  // This is a heuristic — in practice we'd store mode on-chain or derive from creation tx
  const now = _now || Math.floor(Date.now() / 1000);
  const remaining = deadline - now;
  if (remaining < 0) return 'flash'; // expired, default
  if (remaining <= 3600) return 'blitz';
  if (remaining <= 14400) return 'flash';
  return 'voyage';
}

function mapStatus(statusEnum: any): PoolStatus {
  if (statusEnum.active) return 'active';
  if (statusEnum.succeeded) return 'succeeded';
  if (statusEnum.failed) return 'failed';
  if (statusEnum.launched) return 'launched';
  return 'active';
}

function mapAccess(accessEnum: any): AccessMode {
  if (accessEnum.crew) return 'crew';
  return 'public';
}

export function useSolanaBoardingPools() {
  const [pools, setPools] = useState<BoardingPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      try {
        const program = getReadOnlyProgram();
        const accounts = await (program.account as any).boardingPool.all();

        if (cancelled) return;

        const mapped: BoardingPool[] = accounts.map((acc: any) => {
          const d = acc.account;
          const deadline = d.deadline.toNumber();
          return {
            publicKey: acc.publicKey.toBase58(),
            creator: d.creator.toBase58(),
            tokenMint: d.tokenMint.toBase58(),
            tokenName: '', // not stored on-chain, will be enriched later
            tokenSymbol: '', // same
            hardCap: d.hardCap.toNumber() / 1e9, // lamports to SOL
            perWalletCap: d.perWalletCap.toNumber() / 1e9,
            minWallets: d.minWallets.toNumber(),
            deadline,
            status: mapStatus(d.status),
            totalDeposited: d.totalDeposited.toNumber() / 1e9,
            participantCount: d.participantCount.toNumber(),
            tokenSupply: d.tokenSupply.toNumber(),
            mode: deriveModeFromDeadline(deadline),
            access: mapAccess(d.accessMode),
            chain: 'sol' as const,
          };
        });

        setPools(mapped);
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, []);

  return { pools, loading, error };
}
