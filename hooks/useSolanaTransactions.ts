"use client";
import { useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import IDL from '../target/idl/boarding.json';
import { SOLANA_PROGRAM_ID } from '../lib/contracts';

// Seed constants matching the Rust program
const BOARDING_POOL_SEED = Buffer.from('boarding_pool');
const TOKEN_VAULT_SEED = Buffer.from('token_vault');
const SOL_VAULT_SEED = Buffer.from('sol_vault');
const DEPOSIT_SEED = Buffer.from('deposit');
const TICKER_SEED = Buffer.from('ticker');
const CREW_PASS_SEED = Buffer.from('crew_pass');

// Platform treasury (from Anchor.toml or deploy config)
const PLATFORM_TREASURY = new PublicKey('11111111111111111111111111111111'); // TODO: set real treasury

function useProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  if (!wallet.publicKey || !wallet.signTransaction) return null;

  const provider = new AnchorProvider(
    connection,
    wallet as any,
    { commitment: 'confirmed' }
  );

  return new Program(IDL as any, provider);
}

function derivePoolPda(tokenMint: PublicKey, creator: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [BOARDING_POOL_SEED, tokenMint.toBuffer(), creator.toBuffer()],
    SOLANA_PROGRAM_ID
  );
}

function deriveTokenVault(pool: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [TOKEN_VAULT_SEED, pool.toBuffer()],
    SOLANA_PROGRAM_ID
  );
}

function deriveSolVault(pool: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [SOL_VAULT_SEED, pool.toBuffer()],
    SOLANA_PROGRAM_ID
  );
}

function deriveDeposit(pool: PublicKey, depositor: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [DEPOSIT_SEED, pool.toBuffer(), depositor.toBuffer()],
    SOLANA_PROGRAM_ID
  );
}

function deriveTickerClaim(ticker: string) {
  const tickerBytes = Buffer.alloc(10);
  tickerBytes.write(ticker.toUpperCase());
  return PublicKey.findProgramAddressSync(
    [TICKER_SEED, tickerBytes],
    SOLANA_PROGRAM_ID
  );
}

function deriveCrewPass(pool: PublicKey, member: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [CREW_PASS_SEED, pool.toBuffer(), member.toBuffer()],
    SOLANA_PROGRAM_ID
  );
}

export function useSolanaTransactions() {
  const program = useProgram();
  const { publicKey } = useWallet();

  const createPool = useCallback(async (params: {
    tokenMint: PublicKey;
    hardCap: number;     // in SOL
    perWalletCap: number; // in SOL
    duration: number;     // in seconds
    tokenSupply: number;
    accessMode: 'public' | 'crew';
    ticker: string;
  }) => {
    if (!program || !publicKey) throw new Error('Wallet not connected');

    const { tokenMint, hardCap, perWalletCap, duration, tokenSupply, accessMode, ticker } = params;

    const [poolPda] = derivePoolPda(tokenMint, publicKey);
    const [tokenVault] = deriveTokenVault(poolPda);
    const [solVault] = deriveSolVault(poolPda);
    const [tickerClaim] = deriveTickerClaim(ticker);
    const creatorTokenAccount = getAssociatedTokenAddressSync(tokenMint, publicKey);

    const tx = await (program.methods as any)
      .createPool(
        new BN(hardCap * 1e9),           // lamports
        new BN(perWalletCap * 1e9),      // lamports
        new BN(duration),
        new BN(tokenSupply),
        { [accessMode]: {} },            // enum variant
        ticker.toUpperCase()
      )
      .accountsPartial({
        pool: poolPda,
        tokenVault,
        solVault,
        tickerClaim,
        tokenMint,
        creatorTokenAccount,
        platformTreasury: PLATFORM_TREASURY,
        creator: publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    return { tx, poolPda: poolPda.toBase58() };
  }, [program, publicKey]);

  const deposit = useCallback(async (params: {
    poolPda: string;
    tokenMint: string;
    creator: string;
    amount: number; // in SOL
    isCrewPool: boolean;
  }) => {
    if (!program || !publicKey) throw new Error('Wallet not connected');

    const pool = new PublicKey(params.poolPda);
    const [depositPda] = deriveDeposit(pool, publicKey);
    const [solVault] = deriveSolVault(pool);

    // For crew pools, derive crew pass; for public, pass null
    let crewPass: PublicKey | null = null;
    if (params.isCrewPool) {
      [crewPass] = deriveCrewPass(pool, publicKey);
    }

    const accounts: any = {
      pool,
      depositAccount: depositPda,
      solVault,
      depositor: publicKey,
      systemProgram: SystemProgram.programId,
    };

    // Only include crewPass if it's a crew pool
    if (crewPass) {
      accounts.crewPass = crewPass;
    }

    const tx = await (program.methods as any)
      .deposit(new BN(params.amount * 1e9))
      .accountsPartial(accounts)
      .rpc();

    return { tx };
  }, [program, publicKey]);

  const claimRefund = useCallback(async (params: {
    poolPda: string;
  }) => {
    if (!program || !publicKey) throw new Error('Wallet not connected');

    const pool = new PublicKey(params.poolPda);
    const [depositPda] = deriveDeposit(pool, publicKey);
    const [solVault] = deriveSolVault(pool);

    const tx = await (program.methods as any)
      .claimRefund()
      .accountsPartial({
        pool,
        depositAccount: depositPda,
        solVault,
        depositor: publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return { tx };
  }, [program, publicKey]);

  const claimTokens = useCallback(async (params: {
    poolPda: string;
    tokenMint: string;
  }) => {
    if (!program || !publicKey) throw new Error('Wallet not connected');

    const pool = new PublicKey(params.poolPda);
    const tokenMint = new PublicKey(params.tokenMint);
    const [depositPda] = deriveDeposit(pool, publicKey);
    const [tokenVault] = deriveTokenVault(pool);
    const depositorTokenAccount = getAssociatedTokenAddressSync(tokenMint, publicKey);

    const tx = await (program.methods as any)
      .claimTokens()
      .accountsPartial({
        pool,
        depositAccount: depositPda,
        tokenVault,
        depositorTokenAccount,
        depositor: publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return { tx };
  }, [program, publicKey]);

  return { createPool, deposit, claimRefund, claimTokens };
}
