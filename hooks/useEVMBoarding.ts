"use client";
import { useState, useEffect } from 'react';
import { readContract } from '@wagmi/core';
import { wagmiConfig } from '../providers/EVMProvider';
import { BOARDING_ABI } from '../lib/evm-abi';
import { BASE_BOARDING_ADDRESS, BASE_CHAIN } from '../lib/contracts';
import type { BoardingPool, PoolStatus, BoardingMode } from './useBoarding';

const STATUS_MAP: PoolStatus[] = ['active', 'succeeded', 'failed', 'launched'];

function deriveModeFromDuration(deadline: number): BoardingMode {
  const now = Math.floor(Date.now() / 1000);
  const remaining = deadline - now;
  if (remaining < 0) return 'flash';
  if (remaining <= 3600) return 'blitz';
  if (remaining <= 14400) return 'flash';
  return 'voyage';
}

export function useEVMBoardingPools() {
  const [pools, setPools] = useState<BoardingPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      try {
        const count = await readContract(wagmiConfig, {
          address: BASE_BOARDING_ADDRESS,
          abi: BOARDING_ABI,
          functionName: 'poolCount',
          chainId: BASE_CHAIN.id,
        });

        const poolCount = Number(count);
        if (poolCount === 0) {
          setPools([]);
          setLoading(false);
          return;
        }

        const results = await Promise.all(
          Array.from({ length: poolCount }, (_, i) =>
            readContract(wagmiConfig, {
              address: BASE_BOARDING_ADDRESS,
              abi: BOARDING_ABI,
              functionName: 'getPool',
              args: [BigInt(i)],
              chainId: BASE_CHAIN.id,
            })
          )
        );

        if (cancelled) return;

        const mapped: BoardingPool[] = results.map((pool: any, i) => {
          const deadline = Number(pool.deadline);
          const hardCap = Number(pool.hardCap) / 1e18; // wei to ETH
          const perWalletCap = Number(pool.perWalletCap) / 1e18;
          const totalDeposited = Number(pool.totalDeposited) / 1e18;
          const minWallets = Math.ceil(hardCap / (perWalletCap || 1));

          return {
            publicKey: String(i),
            creator: pool.creator,
            tokenMint: pool.token,
            tokenName: pool.ticker || `Pool #${i}`,
            tokenSymbol: pool.ticker || '',
            hardCap,
            perWalletCap,
            minWallets,
            deadline,
            status: STATUS_MAP[pool.status] || 'active',
            totalDeposited,
            participantCount: Number(pool.participantCount),
            tokenSupply: Number(pool.tokenSupply),
            mode: deriveModeFromDuration(deadline),
            access: 'public' as const, // EVM contract doesn't have crew mode
            chain: 'base' as const,
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
