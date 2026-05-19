"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAccount } from 'wagmi';
import { type BoardingPool, useCountdown } from '../../hooks/useBoarding';
import { useChain } from '../../providers/ChainProvider';
import { useSolanaTransactions } from '../../hooks/useSolanaTransactions';
import { useEVMTransactions } from '../../hooks/useEVMTransactions';
import { EXPLORER } from '../../lib/contracts';

interface BoardingDetailProps {
  pool: BoardingPool;
  chain: string;
}

export default function BoardingDetail({ pool, chain }: BoardingDetailProps) {
  const solWallet = useWallet();
  const evmAccount = useAccount();
  const solanaTx = useSolanaTransactions();
  const evmTx = useEVMTransactions();
  const timeLeft = useCountdown(pool.deadline);
  const [depositAmount, setDepositAmount] = useState('');
  const [pending, setPending] = useState(false);
  const [txResult, setTxResult] = useState<{ tx: string; type: 'success' | 'error' } | null>(null);

  const progress = (pool.totalDeposited / pool.hardCap) * 100;
  const isActive = pool.status === 'active';
  const isFailed = pool.status === 'failed';
  const isLaunched = pool.status === 'launched';
  const currency = chain === 'base' ? 'ETH' : 'SOL';
  const explorer = chain === 'base' ? EXPLORER.base : EXPLORER.sol;
  const connected = chain === 'base' ? evmAccount.isConnected : solWallet.connected;

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0 || amount > pool.perWalletCap) return;
    setPending(true);
    setTxResult(null);
    try {
      let result;
      if (chain === 'base') {
        result = await evmTx.deposit({ poolId: Number(pool.publicKey), amount });
      } else {
        result = await solanaTx.deposit({
          poolPda: pool.publicKey,
          tokenMint: pool.tokenMint,
          creator: pool.creator,
          amount,
          isCrewPool: pool.access === 'crew',
        });
      }
      setTxResult({ tx: result.tx, type: 'success' });
      setDepositAmount('');
    } catch (err: any) {
      setTxResult({ tx: err.message || 'Transaction failed', type: 'error' });
    } finally {
      setPending(false);
    }
  };

  const handleRefund = async () => {
    setPending(true);
    setTxResult(null);
    try {
      let result;
      if (chain === 'base') {
        result = await evmTx.claimRefund({ poolId: Number(pool.publicKey) });
      } else {
        result = await solanaTx.claimRefund({ poolPda: pool.publicKey });
      }
      setTxResult({ tx: result.tx, type: 'success' });
    } catch (err: any) {
      setTxResult({ tx: err.message || 'Transaction failed', type: 'error' });
    } finally {
      setPending(false);
    }
  };

  const handleClaimTokens = async () => {
    setPending(true);
    setTxResult(null);
    try {
      let result;
      if (chain === 'base') {
        result = await evmTx.claimTokens({ poolId: Number(pool.publicKey) });
      } else {
        result = await solanaTx.claimTokens({ poolPda: pool.publicKey, tokenMint: pool.tokenMint });
      }
      setTxResult({ tx: result.tx, type: 'success' });
    } catch (err: any) {
      setTxResult({ tx: err.message || 'Transaction failed', type: 'error' });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fade-up px-10 py-10 max-w-[1200px] mx-auto">
      <Link
        href="/boarding"
        className="text-[11px] text-text-dim hover:text-primary transition-colors mb-6 inline-block no-underline"
      >
        ← BACK
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center text-xl border border-[rgba(136,192,255,0.1)]">
            {pool.mode === 'blitz' ? '💥' : pool.mode === 'flash' ? '⚡' : '🧭'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-[24px] font-bold text-white leading-tight">{pool.tokenName}</h1>
              <span className={`px-2 py-0.5 rounded text-[8px] tracking-[1px] border ${
                chain === 'base'
                  ? 'text-[#3b82f6] bg-[#3b82f6]/8 border-[#3b82f6]/20'
                  : 'text-[#9945ff] bg-[#9945ff]/8 border-[#9945ff]/20'
              }`}>
                {chain === 'base' ? 'BASE' : 'SOL'}
              </span>
            </div>
            <div className="text-[11px] text-text-dim font-mono">${pool.tokenSymbol} · {pool.mode === 'blitz' ? 'Blitz' : pool.mode === 'flash' ? 'Flash' : 'Voyage'}{pool.access === 'crew' ? ' · Crew' : ''}</div>
          </div>
        </div>
        {isActive && (
          <div className="text-right">
            <div className="text-[8px] text-text-dim tracking-[2px] mb-0.5">TIME LEFT</div>
            <div className="font-mono text-lg font-bold text-primary tabular-nums">{timeLeft}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-5">
        {/* Left — pool info */}
        <div>
          {/* Progress */}
          <div className="p-5 bg-bg-glass border border-[rgba(136,192,255,0.08)] rounded-xl mb-4">
            <div className="flex justify-between items-end mb-3">
              <div>
                <div className="text-[8px] text-text-dim tracking-[2px] mb-1">RAISED</div>
                <div className="font-heading text-[28px] font-bold text-white leading-none tabular-nums">
                  {pool.totalDeposited} <span className="text-base text-text-dim">/ {pool.hardCap} {currency}</span>
                </div>
              </div>
              <span className="font-heading text-[28px] font-bold text-primary tabular-nums">{Math.round(progress)}%</span>
            </div>

            <div className="h-3 bg-[rgba(136,192,255,0.06)] rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full progress-fill ${
                  isFailed
                    ? 'bg-burn/60'
                    : 'bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_12px_rgba(136,192,255,0.3)]'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'HARD CAP', value: `${pool.hardCap} ${currency}` },
                { label: 'PER WALLET', value: `${pool.perWalletCap} ${currency}` },
                { label: 'WALLETS', value: `${pool.participantCount}/${pool.minWallets}` },
                { label: 'SUPPLY', value: `${(pool.tokenSupply / 1e6).toFixed(0)}M` },
              ].map((stat, i) => (
                <div key={i} className="p-2.5 bg-bg-input rounded-lg">
                  <div className="text-[7px] text-text-dim tracking-[1px] mb-0.5">{stat.label}</div>
                  <div className="text-xs text-white font-semibold tabular-nums">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="p-5 bg-bg-glass border border-[rgba(136,192,255,0.08)] rounded-xl">
            <div className="text-[8px] text-primary tracking-[2px] mb-3">HOW IT WORKS</div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { n: '01', title: 'COMMIT', desc: `Up to ${pool.perWalletCap} ${currency}` },
                { n: '02', title: 'HIT TARGET', desc: `${pool.hardCap} ${currency} from ${pool.minWallets}+ wallets` },
                { n: '03', title: 'LAUNCH', desc: 'Claim 60% of tokens. 35% + funds → LP (burned).' },
              ].map((s, i) => (
                <div key={i} className="p-3 bg-bg-input rounded-lg">
                  <div className="text-[9px] text-primary/30 font-heading font-bold mb-1">{s.n}</div>
                  <div className="text-[10px] text-white font-semibold mb-0.5">{s.title}</div>
                  <div className="text-[9px] text-text-dim leading-snug">{s.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-2.5 p-2.5 bg-burn/5 border border-burn/10 rounded-lg">
              <div className="text-[9px] text-burn">
                Miss the target? 100% refund. No fees taken.
              </div>
            </div>
          </div>
        </div>

        {/* Right — actions */}
        <div>
          {/* Tx result toast */}
          {txResult && (
            <div className={`p-3 mb-4 rounded-lg border text-[11px] ${
              txResult.type === 'success'
                ? 'bg-success/5 border-success/20 text-success'
                : 'bg-burn/5 border-burn/20 text-burn'
            }`}>
              {txResult.type === 'success' ? (
                <>
                  Transaction confirmed.{' '}
                  <a
                    href={explorer.tx(txResult.tx)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-80"
                  >
                    View on explorer →
                  </a>
                </>
              ) : (
                <>{txResult.tx}</>
              )}
            </div>
          )}

          {/* Deposit */}
          {isActive && (
            <div className="p-5 bg-bg-glass border border-primary/15 rounded-xl mb-4">
              {pool.access === 'crew' && (
                <div className="flex items-center gap-2 mb-3 p-2 bg-[#34d399]/5 border border-[#34d399]/15 rounded-lg">
                  <span className="text-[10px] text-[#34d399]">🔒 Crew only — invite required</span>
                </div>
              )}
              <div className="text-[8px] text-primary tracking-[2px] mb-3">BOARD THIS VESSEL</div>

              <div className="mb-3">
                <label className="block text-[8px] text-text-dim tracking-[2px] mb-1.5">AMOUNT ({currency})</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max={pool.perWalletCap}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder={`Max ${pool.perWalletCap}`}
                    className="w-full p-3 bg-bg-input border border-border-primary rounded-lg text-white text-sm font-mono pr-16"
                  />
                  <button
                    onClick={() => setDepositAmount(String(pool.perWalletCap))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-primary/10 text-primary text-[8px] rounded border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Fee breakdown */}
              <div className="p-2.5 bg-bg-input rounded-lg mb-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-[9px] text-text-dim">60% tokens → you (presale)</span>
                  <span className="text-[9px] text-white">claim after launch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px] text-text-dim">35% tokens + 92.5% {currency} → LP</span>
                  <span className="text-[9px] text-primary">burned</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px] text-text-dim">7.5% {currency} → creator + platform</span>
                  <span className="text-[9px] text-text-muted">fees</span>
                </div>
              </div>

              <button
                onClick={handleDeposit}
                disabled={!connected || pending}
                className={`w-full py-3.5 rounded-lg font-heading text-sm font-bold tracking-[1px] transition-all duration-200 ${
                  connected && !pending
                    ? 'bg-gradient-to-br from-primary to-primary-dark text-bg-base cursor-pointer shadow-[0_2px_20px_rgba(136,192,255,0.3)] hover:shadow-[0_4px_30px_rgba(136,192,255,0.5)]'
                    : 'bg-primary/8 text-text-dim cursor-not-allowed border border-border-primary'
                }`}
              >
                {!connected ? 'CONNECT WALLET' : pending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border-2 border-bg-base/30 border-t-bg-base rounded-full animate-spin" />
                    BOARDING...
                  </span>
                ) : `COMMIT ${currency}`}
              </button>
            </div>
          )}

          {/* Refund */}
          {isFailed && (
            <div className="p-5 bg-bg-glass border border-burn/20 rounded-xl mb-4">
              <div className="text-[8px] text-burn tracking-[2px] mb-2">POOL FAILED</div>
              <p className="text-[11px] text-text-muted mb-3">
                Didn&apos;t hit {pool.hardCap} {currency}. Your deposit is fully refundable.
              </p>
              <button
                onClick={handleRefund}
                disabled={!connected || pending}
                className={`w-full py-3.5 rounded-lg font-heading text-sm font-bold tracking-[1px] ${
                  connected && !pending
                    ? 'bg-gradient-to-r from-burn to-burn-dark text-white cursor-pointer'
                    : 'bg-burn/8 text-text-dim cursor-not-allowed border border-burn/15'
                }`}
              >
                {!connected ? 'CONNECT WALLET' : pending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    CLAIMING...
                  </span>
                ) : 'CLAIM REFUND'}
              </button>
            </div>
          )}

          {/* Succeeded */}
          {pool.status === 'succeeded' && (
            <div className="p-5 bg-bg-glass border border-success/20 rounded-xl mb-4">
              <div className="text-[8px] text-success tracking-[2px] mb-2">TARGET REACHED</div>
              <p className="text-[11px] text-text-muted">
                {pool.hardCap} {currency} hit. Awaiting launch...
              </p>
            </div>
          )}

          {/* Launched — claim tokens */}
          {isLaunched && (
            <div className="p-5 bg-bg-glass border border-[#a78bfa]/20 rounded-xl mb-4">
              <div className="text-[8px] text-[#a78bfa] tracking-[2px] mb-2">LAUNCHED</div>
              <p className="text-[11px] text-text-muted mb-3">LP created and burned. This vessel is sailing.</p>

              <button
                onClick={handleClaimTokens}
                disabled={!connected || pending}
                className={`w-full py-3 mb-2 rounded-lg font-heading text-sm font-bold tracking-[1px] transition-all ${
                  connected && !pending
                    ? 'bg-gradient-to-br from-primary to-primary-dark text-bg-base cursor-pointer shadow-[0_2px_20px_rgba(136,192,255,0.3)]'
                    : 'bg-primary/8 text-text-dim cursor-not-allowed border border-border-primary'
                }`}
              >
                {!connected ? 'CONNECT WALLET' : pending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border-2 border-bg-base/30 border-t-bg-base rounded-full animate-spin" />
                    CLAIMING...
                  </span>
                ) : 'CLAIM TOKENS'}
              </button>

              <button className="w-full py-2.5 bg-[#a78bfa]/8 text-[#a78bfa] border border-[#a78bfa]/20 rounded-lg text-[11px] font-semibold cursor-pointer hover:bg-[#a78bfa]/15 transition-colors">
                VIEW ON {chain === 'base' ? 'UNISWAP' : 'RAYDIUM'} →
              </button>
            </div>
          )}

          {/* Creator */}
          <div className="p-4 bg-bg-glass border border-[rgba(136,192,255,0.08)] rounded-xl">
            <div className="text-[8px] text-text-dim tracking-[2px] mb-2">CREATOR</div>
            <a
              href={explorer.account(pool.creator)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary font-mono hover:underline"
            >
              {pool.creator.slice(0, 6)}...{pool.creator.slice(-4)}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
