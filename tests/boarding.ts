import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Boarding } from "../target/types/boarding";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
} from "@solana/spl-token";
import { assert } from "chai";

describe("boarding", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Boarding as Program<Boarding>;

  let tokenMint: PublicKey;
  let creator: Keypair;
  let creatorTokenAccount: PublicKey;
  const TOKEN_SUPPLY = 1_000_000_000; // 1B tokens
  const HARD_CAP = 80 * LAMPORTS_PER_SOL;
  const PER_WALLET_CAP = 2 * LAMPORTS_PER_SOL;
  const DURATION = 12 * 3600; // 12 hours

  before(async () => {
    creator = Keypair.generate();

    // Airdrop SOL to creator
    const sig = await provider.connection.requestAirdrop(
      creator.publicKey,
      10 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);

    // Create token mint
    tokenMint = await createMint(
      provider.connection,
      creator,
      creator.publicKey,
      null,
      6
    );

    // Create creator's token account and mint tokens
    creatorTokenAccount = await createAccount(
      provider.connection,
      creator,
      tokenMint,
      creator.publicKey
    );

    await mintTo(
      provider.connection,
      creator,
      tokenMint,
      creatorTokenAccount,
      creator,
      TOKEN_SUPPLY
    );
  });

  const getPoolPDA = () => {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("boarding_pool"),
        tokenMint.toBuffer(),
        creator.publicKey.toBuffer(),
      ],
      program.programId
    );
  };

  const getTokenVaultPDA = (poolKey: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("token_vault"), poolKey.toBuffer()],
      program.programId
    );
  };

  const getSolVaultPDA = (poolKey: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("sol_vault"), poolKey.toBuffer()],
      program.programId
    );
  };

  const getDepositPDA = (poolKey: PublicKey, depositor: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("deposit"),
        poolKey.toBuffer(),
        depositor.toBuffer(),
      ],
      program.programId
    );
  };

  it("creates a boarding pool", async () => {
    const [poolKey] = getPoolPDA();
    const [tokenVault] = getTokenVaultPDA(poolKey);
    const [solVault] = getSolVaultPDA(poolKey);

    await program.methods
      .createPool(
        new anchor.BN(HARD_CAP),
        new anchor.BN(PER_WALLET_CAP),
        new anchor.BN(DURATION),
        new anchor.BN(TOKEN_SUPPLY)
      )
      .accounts({
        pool: poolKey,
        tokenVault,
        solVault,
        tokenMint,
        creatorTokenAccount,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([creator])
      .rpc();

    const pool = await program.account.boardingPool.fetch(poolKey);
    assert.ok(pool.creator.equals(creator.publicKey));
    assert.equal(pool.hardCap.toNumber(), HARD_CAP);
    assert.equal(pool.perWalletCap.toNumber(), PER_WALLET_CAP);
    assert.equal(pool.minWallets.toNumber(), 40);
    assert.deepEqual(pool.status, { active: {} });
    assert.equal(pool.totalDeposited.toNumber(), 0);
    assert.equal(pool.participantCount.toNumber(), 0);
  });

  it("accepts deposits", async () => {
    const depositor = Keypair.generate();
    const sig = await provider.connection.requestAirdrop(
      depositor.publicKey,
      5 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);

    const [poolKey] = getPoolPDA();
    const [solVault] = getSolVaultPDA(poolKey);
    const [depositPDA] = getDepositPDA(poolKey, depositor.publicKey);

    const depositAmount = 1.5 * LAMPORTS_PER_SOL;

    await program.methods
      .deposit(new anchor.BN(depositAmount))
      .accounts({
        pool: poolKey,
        depositAccount: depositPDA,
        solVault,
        depositor: depositor.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([depositor])
      .rpc();

    const pool = await program.account.boardingPool.fetch(poolKey);
    assert.equal(pool.totalDeposited.toNumber(), depositAmount);
    assert.equal(pool.participantCount.toNumber(), 1);

    const deposit = await program.account.depositAccount.fetch(depositPDA);
    assert.equal(deposit.amount.toNumber(), depositAmount);
    assert.ok(!deposit.claimed);
  });

  it("rejects deposit exceeding per-wallet cap", async () => {
    const depositor = Keypair.generate();
    const sig = await provider.connection.requestAirdrop(
      depositor.publicKey,
      5 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);

    const [poolKey] = getPoolPDA();
    const [solVault] = getSolVaultPDA(poolKey);
    const [depositPDA] = getDepositPDA(poolKey, depositor.publicKey);

    try {
      await program.methods
        .deposit(new anchor.BN(3 * LAMPORTS_PER_SOL)) // > 2 SOL cap
        .accounts({
          pool: poolKey,
          depositAccount: depositPDA,
          solVault,
          depositor: depositor.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([depositor])
        .rpc();
      assert.fail("Should have thrown");
    } catch (err) {
      assert.include(err.toString(), "ExceedsPerWalletCap");
    }
  });

  it("cannot finalize before deadline", async () => {
    const [poolKey] = getPoolPDA();

    try {
      await program.methods
        .finalizeFailure()
        .accounts({
          pool: poolKey,
          cranker: provider.wallet.publicKey,
        })
        .rpc();
      assert.fail("Should have thrown");
    } catch (err) {
      assert.include(err.toString(), "PoolNotExpired");
    }
  });
});
