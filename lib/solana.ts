import { Connection } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { SOLANA_PROGRAM_ID, SOLANA_RPC } from './contracts';
import IDL from '../target/idl/boarding.json';

// Read-only connection (no wallet needed for fetching)
export function getConnection() {
  return new Connection(SOLANA_RPC, 'confirmed');
}

// Read-only program instance for fetching account data
export function getReadOnlyProgram() {
  const connection = getConnection();
  // Anchor requires a provider but for read-only we use a dummy
  const provider = new AnchorProvider(
    connection,
    // Dummy wallet — we only read, never sign
    { publicKey: SOLANA_PROGRAM_ID, signTransaction: async (tx: any) => tx, signAllTransactions: async (txs: any) => txs } as any,
    { commitment: 'confirmed' }
  );
  return new Program(IDL as any, provider);
}
