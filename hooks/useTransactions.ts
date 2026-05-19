"use client";
import { useChain } from '../providers/ChainProvider';
import { useSolanaTransactions } from './useSolanaTransactions';
import { useEVMTransactions } from './useEVMTransactions';

export function useTransactions() {
  const { chain } = useChain();
  const solana = useSolanaTransactions();
  const evm = useEVMTransactions();

  return chain === 'sol' ? solana : evm;
}
