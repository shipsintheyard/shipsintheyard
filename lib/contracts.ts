import { PublicKey } from '@solana/web3.js';
import { baseSepolia } from 'wagmi/chains';

// ── Solana ──────────────────────────────────────────────
export const SOLANA_PROGRAM_ID = new PublicKey('BPWbd4qq5nwn6zoAC5dcLjdK7whuvJMdnAjY74F63YSq');
export const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

// ── Base (EVM) ──────────────────────────────────────────
export const BASE_BOARDING_ADDRESS = '0x4475bb8D73b2a86238e49f16e94DB83e9755B8BB' as const;
export const BASE_CHAIN = baseSepolia;

// ── Explorer URLs ───────────────────────────────────────
export const EXPLORER = {
  sol: {
    tx: (sig: string) => `https://solscan.io/tx/${sig}?cluster=devnet`,
    account: (addr: string) => `https://solscan.io/account/${addr}?cluster=devnet`,
  },
  base: {
    tx: (hash: string) => `https://sepolia.basescan.org/tx/${hash}`,
    account: (addr: string) => `https://sepolia.basescan.org/address/${addr}`,
  },
} as const;
