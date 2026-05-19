"use client";
import { useSolanaBoardingPools } from './useSolanaBoarding';
import { useEVMBoardingPools } from './useEVMBoarding';
import type { BoardingPool } from './useBoarding';

export function useMultichainBoardingPools() {
  const sol = useSolanaBoardingPools();
  const evm = useEVMBoardingPools();

  const pools: BoardingPool[] = [...sol.pools, ...evm.pools];
  const loading = sol.loading || evm.loading;
  const error = sol.error || evm.error;

  return { pools, loading, error };
}
