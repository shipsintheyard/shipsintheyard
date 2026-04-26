use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("Board1111111111111111111111111111111111111");

// ============================================================================
// Constants
// ============================================================================

pub const BLITZ_DURATION: i64 = 30 * 60;     // 30 min — meme narratives
pub const FLASH_DURATION: i64 = 4 * 3600;     // 4 hours — quick launches
pub const VOYAGE_DURATION: i64 = 72 * 3600;   // 72 hours — community building
pub const MIN_DURATION: i64 = 30 * 60;        // 30 min
pub const MAX_DURATION: i64 = 72 * 3600;      // 72 hours
pub const MAX_TICKER_LEN: usize = 10;
pub const PLATFORM_FEE_BPS: u64 = 500;    // 5% SOL → platform
pub const CREATOR_FEE_BPS: u64 = 250;     // 2.5% SOL → creator
pub const LIQUIDITY_BPS: u64 = 9250;      // 92.5% SOL → LP
pub const CREATOR_TOKEN_BPS: u64 = 500;   // 5% tokens → creator dev bag
pub const PRESALE_TOKEN_BPS: u64 = 6000;  // 60% tokens → presale buyers
pub const LP_TOKEN_BPS: u64 = 3500;       // 35% tokens → LP

/// Non-refundable creation fee to open a pool. Goes to platform treasury.
/// Keeps it serious — creator is betting on themselves.
pub const CREATION_FEE: u64 = 500_000_000; // 0.5 SOL

/// Emergency escape hatch: depositors can withdraw after 30 days regardless
/// of pool status. Prevents funds from ever being permanently stuck.
pub const EMERGENCY_TIMELOCK: i64 = 30 * 24 * 3600; // 30 days

#[program]
pub mod boarding {
    use super::*;

    /// Creator initializes a new boarding pool.
    pub fn create_pool(
        ctx: Context<CreatePool>,
        hard_cap: u64,
        per_wallet_cap: u64,
        duration: i64,
        token_supply: u64,
        access_mode: AccessMode,
        ticker: String,
    ) -> Result<()> {
        require!(hard_cap > 0, BoardingError::InvalidHardCap);
        require!(per_wallet_cap > 0 && per_wallet_cap <= hard_cap, BoardingError::InvalidPerWalletCap);
        require!(duration >= MIN_DURATION && duration <= MAX_DURATION, BoardingError::InvalidDuration);
        require!(token_supply > 0, BoardingError::InvalidTokenSupply);

        // Validate ticker
        let ticker_bytes = ticker.as_bytes();
        require!(ticker_bytes.len() >= 1 && ticker_bytes.len() <= MAX_TICKER_LEN, BoardingError::InvalidTicker);
        require!(
            ticker_bytes.iter().all(|b| b.is_ascii_alphanumeric()),
            BoardingError::InvalidTicker
        );

        // Store ticker in claim PDA (init handled by Anchor in accounts)
        let mut ticker_padded = [0u8; 10];
        for (i, &b) in ticker_bytes.iter().enumerate() {
            ticker_padded[i] = b.to_ascii_uppercase();
        }
        let ticker_claim = &mut ctx.accounts.ticker_claim;
        ticker_claim.pool = ctx.accounts.pool.key();
        ticker_claim.ticker = ticker_padded;
        ticker_claim.bump = ctx.bumps.ticker_claim;

        let clock = Clock::get()?;
        let min_wallets = hard_cap.checked_div(per_wallet_cap).unwrap();

        let pool = &mut ctx.accounts.pool;
        pool.creator = ctx.accounts.creator.key();
        pool.token_mint = ctx.accounts.token_mint.key();
        pool.hard_cap = hard_cap;
        pool.per_wallet_cap = per_wallet_cap;
        pool.min_wallets = min_wallets;
        pool.deadline = clock.unix_timestamp.checked_add(duration).unwrap();
        pool.status = PoolStatus::Active;
        pool.paused = false;
        pool.total_deposited = 0;
        pool.participant_count = 0;
        pool.token_supply = token_supply;
        pool.access_mode = access_mode;
        pool.bump = ctx.bumps.pool;
        pool.vault_bump = ctx.bumps.token_vault;
        pool.sol_vault_bump = ctx.bumps.sol_vault;

        // Non-refundable creation fee → platform treasury
        let fee_ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.creator.key(),
            &ctx.accounts.platform_treasury.key(),
            CREATION_FEE,
        );
        anchor_lang::solana_program::program::invoke(
            &fee_ix,
            &[
                ctx.accounts.creator.to_account_info(),
                ctx.accounts.platform_treasury.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // Transfer token supply from creator to vault
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.creator_token_account.to_account_info(),
                    to: ctx.accounts.token_vault.to_account_info(),
                    authority: ctx.accounts.creator.to_account_info(),
                },
            ),
            token_supply,
        )?;

        emit!(PoolCreated {
            pool: pool.key(),
            creator: pool.creator,
            token_mint: pool.token_mint,
            hard_cap,
            per_wallet_cap,
            deadline: pool.deadline,
        });

        Ok(())
    }

    /// Participant deposits SOL into an active pool.
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let pool = &ctx.accounts.pool;
        let clock = Clock::get()?;

        require!(pool.status == PoolStatus::Active, BoardingError::PoolNotActive);
        require!(!pool.paused, BoardingError::PoolPaused);
        require!(clock.unix_timestamp < pool.deadline, BoardingError::PoolExpired);
        require!(amount > 0, BoardingError::ZeroDeposit);

        // Crew check
        if pool.access_mode == AccessMode::Crew {
            let crew_pass = ctx.accounts.crew_pass
                .as_ref()
                .ok_or(BoardingError::NotOnCrewList)?;
            require!(
                crew_pass.pool == ctx.accounts.pool.key()
                    && crew_pass.wallet == ctx.accounts.depositor.key(),
                BoardingError::NotOnCrewList
            );
        }

        // Per-wallet cap (cumulative)
        let deposit_account = &ctx.accounts.deposit_account;
        let new_total = deposit_account.amount.checked_add(amount).unwrap();
        require!(new_total <= pool.per_wallet_cap, BoardingError::ExceedsPerWalletCap);

        // Hard cap
        let pool_new_total = pool.total_deposited.checked_add(amount).unwrap();
        require!(pool_new_total <= pool.hard_cap, BoardingError::ExceedsHardCap);

        // Transfer SOL → vault PDA
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.depositor.key(),
            &ctx.accounts.sol_vault.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.depositor.to_account_info(),
                ctx.accounts.sol_vault.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        let deposit_account = &mut ctx.accounts.deposit_account;
        let is_new = deposit_account.amount == 0;
        deposit_account.depositor = ctx.accounts.depositor.key();
        deposit_account.pool = ctx.accounts.pool.key();
        deposit_account.amount = new_total;
        deposit_account.claimed = false;
        deposit_account.tokens_claimed = false;

        let pool = &mut ctx.accounts.pool;
        pool.total_deposited = pool_new_total;
        if is_new {
            pool.participant_count = pool.participant_count.checked_add(1).unwrap();
        }

        emit!(DepositMade {
            pool: pool.key(),
            depositor: ctx.accounts.depositor.key(),
            amount,
            total_deposited: pool.total_deposited,
            participant_count: pool.participant_count,
        });

        Ok(())
    }

    // ========================================================================
    // Safety: Pause + Emergency Withdraw
    // ========================================================================

    /// Creator can pause a pool. Deposits stop, refunds still work.
    pub fn pause_pool(ctx: Context<CreatorAction>) -> Result<()> {
        let pool = &ctx.accounts.pool;
        require!(pool.status == PoolStatus::Active, BoardingError::PoolNotActive);
        require!(!pool.paused, BoardingError::AlreadyPaused);

        let pool = &mut ctx.accounts.pool;
        pool.paused = true;

        emit!(PoolPaused { pool: pool.key() });
        Ok(())
    }

    /// Creator can unpause a pool (only if still before deadline).
    pub fn unpause_pool(ctx: Context<CreatorAction>) -> Result<()> {
        let pool = &ctx.accounts.pool;
        let clock = Clock::get()?;
        require!(pool.status == PoolStatus::Active, BoardingError::PoolNotActive);
        require!(pool.paused, BoardingError::NotPaused);
        require!(clock.unix_timestamp < pool.deadline, BoardingError::PoolExpired);

        let pool = &mut ctx.accounts.pool;
        pool.paused = false;

        emit!(PoolUnpaused { pool: pool.key() });
        Ok(())
    }

    /// Emergency escape hatch: any depositor can withdraw after 30 days past
    /// deadline, regardless of pool status. Prevents funds from ever being stuck.
    pub fn emergency_withdraw(ctx: Context<ClaimRefund>) -> Result<()> {
        let pool = &ctx.accounts.pool;
        let clock = Clock::get()?;

        let escape_time = pool.deadline.checked_add(EMERGENCY_TIMELOCK).unwrap();
        require!(
            clock.unix_timestamp >= escape_time,
            BoardingError::EmergencyTimelockNotReached
        );

        let deposit_account = &ctx.accounts.deposit_account;
        require!(!deposit_account.claimed, BoardingError::AlreadyClaimed);
        require!(deposit_account.amount > 0, BoardingError::ZeroDeposit);

        let amount = deposit_account.amount;

        // Transfer SOL back
        **ctx.accounts.sol_vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.depositor.to_account_info().try_borrow_mut_lamports()? += amount;

        let deposit_account = &mut ctx.accounts.deposit_account;
        deposit_account.claimed = true;

        emit!(EmergencyWithdraw {
            pool: ctx.accounts.pool.key(),
            depositor: ctx.accounts.depositor.key(),
            amount,
        });

        Ok(())
    }

    // ========================================================================
    // Finalization
    // ========================================================================

    /// Permissionless crank: finalize as succeeded if threshold met after deadline.
    pub fn finalize_success(ctx: Context<Finalize>) -> Result<()> {
        let pool = &ctx.accounts.pool;
        let clock = Clock::get()?;

        require!(pool.status == PoolStatus::Active, BoardingError::PoolNotActive);
        require!(clock.unix_timestamp >= pool.deadline, BoardingError::PoolNotExpired);
        require!(pool.total_deposited >= pool.hard_cap, BoardingError::ThresholdNotMet);

        let pool = &mut ctx.accounts.pool;
        pool.status = PoolStatus::Succeeded;

        emit!(PoolFinalized {
            pool: pool.key(),
            status: PoolStatus::Succeeded,
            total_deposited: pool.total_deposited,
            participant_count: pool.participant_count,
        });

        Ok(())
    }

    /// Permissionless crank: finalize as failed if threshold NOT met after deadline.
    pub fn finalize_failure(ctx: Context<Finalize>) -> Result<()> {
        let pool = &ctx.accounts.pool;
        let clock = Clock::get()?;

        require!(pool.status == PoolStatus::Active, BoardingError::PoolNotActive);
        require!(clock.unix_timestamp >= pool.deadline, BoardingError::PoolNotExpired);
        require!(pool.total_deposited < pool.hard_cap, BoardingError::ThresholdMet);

        let pool = &mut ctx.accounts.pool;
        pool.status = PoolStatus::Failed;

        emit!(PoolFinalized {
            pool: pool.key(),
            status: PoolStatus::Failed,
            total_deposited: pool.total_deposited,
            participant_count: pool.participant_count,
        });

        Ok(())
    }

    // ========================================================================
    // Crew management
    // ========================================================================

    pub fn add_to_crew(ctx: Context<ManageCrew>) -> Result<()> {
        let pool = &ctx.accounts.pool;
        require!(pool.access_mode == AccessMode::Crew, BoardingError::PoolNotCrewGated);
        require!(pool.status == PoolStatus::Active, BoardingError::PoolNotActive);

        let crew_pass = &mut ctx.accounts.crew_pass;
        crew_pass.pool = ctx.accounts.pool.key();
        crew_pass.wallet = ctx.accounts.member.key();

        emit!(CrewMemberAdded {
            pool: ctx.accounts.pool.key(),
            wallet: ctx.accounts.member.key(),
        });

        Ok(())
    }

    pub fn remove_from_crew(ctx: Context<RemoveCrew>) -> Result<()> {
        let pool = &ctx.accounts.pool;
        require!(pool.access_mode == AccessMode::Crew, BoardingError::PoolNotCrewGated);
        require!(pool.status == PoolStatus::Active, BoardingError::PoolNotActive);

        emit!(CrewMemberRemoved {
            pool: ctx.accounts.pool.key(),
            wallet: ctx.accounts.crew_pass.wallet,
        });

        Ok(())
    }

    // ========================================================================
    // Refund + Launch
    // ========================================================================

    /// Reclaim SOL from a failed pool.
    pub fn claim_refund(ctx: Context<ClaimRefund>) -> Result<()> {
        let pool = &ctx.accounts.pool;
        require!(pool.status == PoolStatus::Failed, BoardingError::PoolNotFailed);

        let deposit_account = &ctx.accounts.deposit_account;
        require!(!deposit_account.claimed, BoardingError::AlreadyClaimed);
        require!(deposit_account.amount > 0, BoardingError::ZeroDeposit);

        let amount = deposit_account.amount;

        **ctx.accounts.sol_vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.depositor.to_account_info().try_borrow_mut_lamports()? += amount;

        let deposit_account = &mut ctx.accounts.deposit_account;
        deposit_account.claimed = true;

        emit!(RefundClaimed {
            pool: ctx.accounts.pool.key(),
            depositor: ctx.accounts.depositor.key(),
            amount,
        });

        Ok(())
    }

    /// Launch on Raydium after successful finalization.
    /// SOL:    92.5% → LP, 5% → platform, 2.5% → creator
    /// Tokens: 35% → LP, 60% held for presale claims, 5% → creator dev bag
    pub fn launch_pool(ctx: Context<LaunchPool>) -> Result<()> {
        let pool = &ctx.accounts.pool;
        require!(pool.status == PoolStatus::Succeeded, BoardingError::PoolNotSucceeded);

        let total_sol = pool.total_deposited;
        let total_tokens = pool.token_supply;

        // SOL splits
        let liquidity_sol = total_sol.checked_mul(LIQUIDITY_BPS).unwrap().checked_div(10_000).unwrap();
        let creator_sol = total_sol.checked_mul(CREATOR_FEE_BPS).unwrap().checked_div(10_000).unwrap();
        let platform_sol = total_sol.checked_sub(liquidity_sol).unwrap().checked_sub(creator_sol).unwrap();

        // Token splits
        let creator_tokens = total_tokens.checked_mul(CREATOR_TOKEN_BPS).unwrap().checked_div(10_000).unwrap();
        let _presale_tokens = total_tokens.checked_mul(PRESALE_TOKEN_BPS).unwrap().checked_div(10_000).unwrap();
        let _lp_tokens = total_tokens.checked_mul(LP_TOKEN_BPS).unwrap().checked_div(10_000).unwrap();

        let pool_key = ctx.accounts.pool.key();
        let sol_vault_seeds = &[b"sol_vault", pool_key.as_ref(), &[pool.sol_vault_bump]];
        let sol_signer = &[&sol_vault_seeds[..]];

        let token_vault_seeds = &[b"token_vault", pool_key.as_ref(), &[pool.vault_bump]];
        let token_signer = &[&token_vault_seeds[..]];

        // 2.5% SOL → creator
        anchor_lang::solana_program::program::invoke_signed(
            &anchor_lang::solana_program::system_instruction::transfer(
                &ctx.accounts.sol_vault.key(),
                &ctx.accounts.creator.key(),
                creator_sol,
            ),
            &[
                ctx.accounts.sol_vault.to_account_info(),
                ctx.accounts.creator.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            sol_signer,
        )?;

        // 5% SOL → platform
        anchor_lang::solana_program::program::invoke_signed(
            &anchor_lang::solana_program::system_instruction::transfer(
                &ctx.accounts.sol_vault.key(),
                &ctx.accounts.platform_treasury.key(),
                platform_sol,
            ),
            &[
                ctx.accounts.sol_vault.to_account_info(),
                ctx.accounts.platform_treasury.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            sol_signer,
        )?;

        // 5% tokens → creator dev bag
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.token_vault.to_account_info(),
                    to: ctx.accounts.creator_token_account.to_account_info(),
                    authority: ctx.accounts.token_vault.to_account_info(),
                },
                &[token_signer],
            ),
            creator_tokens,
        )?;

        // 60% tokens stay in vault — claimed by presale buyers via claim_tokens
        // 35% tokens + 92.5% SOL → Raydium LP (burned)
        // TODO: Raydium CPMM CPI
        // raydium_cpmm::cpi::proxy_initialize(...)
        // spl_token::burn(lp_tokens)

        let pool = &mut ctx.accounts.pool;
        pool.status = PoolStatus::Launched;

        emit!(PoolLaunched {
            pool: pool.key(),
            liquidity_sol,
            creator_sol,
            platform_sol,
            creator_tokens,
        });

        Ok(())
    }

    /// Presale buyer claims their proportional share of the 60% token allocation.
    /// tokens_owed = (deposit_amount / total_deposited) × presale_tokens
    pub fn claim_tokens(ctx: Context<ClaimTokens>) -> Result<()> {
        let pool = &ctx.accounts.pool;
        require!(pool.status == PoolStatus::Launched, BoardingError::PoolNotLaunched);

        let deposit_account = &ctx.accounts.deposit_account;
        require!(!deposit_account.tokens_claimed, BoardingError::TokensAlreadyClaimed);
        require!(deposit_account.amount > 0, BoardingError::ZeroDeposit);

        // Calculate share: (my_deposit / total_deposited) × 60% of supply
        let presale_tokens = pool.token_supply
            .checked_mul(PRESALE_TOKEN_BPS).unwrap()
            .checked_div(10_000).unwrap();

        let my_tokens = presale_tokens
            .checked_mul(deposit_account.amount).unwrap()
            .checked_div(pool.total_deposited).unwrap();

        // Transfer tokens from vault to depositor
        let pool_key = ctx.accounts.pool.key();
        let token_vault_seeds = &[b"token_vault", pool_key.as_ref(), &[pool.vault_bump]];
        let token_signer = &[&token_vault_seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.token_vault.to_account_info(),
                    to: ctx.accounts.depositor_token_account.to_account_info(),
                    authority: ctx.accounts.token_vault.to_account_info(),
                },
                &[token_signer],
            ),
            my_tokens,
        )?;

        let deposit_account = &mut ctx.accounts.deposit_account;
        deposit_account.tokens_claimed = true;

        emit!(TokensClaimed {
            pool: ctx.accounts.pool.key(),
            depositor: ctx.accounts.depositor.key(),
            amount: my_tokens,
        });

        Ok(())
    }
}

// ============================================================================
// State
// ============================================================================

#[account]
pub struct BoardingPool {
    pub creator: Pubkey,        // 32
    pub token_mint: Pubkey,     // 32
    pub hard_cap: u64,          // 8
    pub per_wallet_cap: u64,    // 8
    pub min_wallets: u64,       // 8
    pub deadline: i64,          // 8
    pub status: PoolStatus,     // 1
    pub paused: bool,           // 1
    pub total_deposited: u64,   // 8
    pub participant_count: u64, // 8
    pub token_supply: u64,      // 8
    pub access_mode: AccessMode,// 1
    pub bump: u8,               // 1
    pub vault_bump: u8,         // 1
    pub sol_vault_bump: u8,     // 1
}

impl BoardingPool {
    pub const LEN: usize = 8  // discriminator
        + 32 + 32             // creator, token_mint
        + 8 + 8 + 8 + 8      // caps, min_wallets, deadline
        + 1 + 1              // status, paused
        + 8 + 8 + 8          // deposited, participants, supply
        + 1                  // access_mode
        + 1 + 1 + 1;         // bumps
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum AccessMode {
    Public,
    Crew,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum PoolStatus {
    Active,
    Succeeded,
    Failed,
    Launched,
}

#[account]
pub struct DepositAccount {
    pub depositor: Pubkey,      // 32
    pub pool: Pubkey,           // 32
    pub amount: u64,            // 8  (SOL deposited in lamports)
    pub claimed: bool,          // 1  (SOL refund claimed)
    pub tokens_claimed: bool,   // 1  (presale tokens claimed)
}

impl DepositAccount {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 1 + 1;
}

#[account]
pub struct CrewPass {
    pub pool: Pubkey,   // 32
    pub wallet: Pubkey, // 32
}

impl CrewPass {
    pub const LEN: usize = 8 + 32 + 32;
}

/// One PDA per ticker symbol. Prevents duplicate tickers on the platform.
/// Seeds: [b"ticker", ticker_uppercase_bytes]
#[account]
pub struct TickerClaim {
    pub pool: Pubkey,       // 32 — the pool that owns this ticker
    pub ticker: [u8; 10],   // 10 — uppercase ASCII, zero-padded
    pub bump: u8,           // 1
}

impl TickerClaim {
    pub const LEN: usize = 8 + 32 + 10 + 1;
}

// ============================================================================
// Accounts
// ============================================================================

#[derive(Accounts)]
#[instruction(hard_cap: u64, per_wallet_cap: u64, duration: i64, token_supply: u64, access_mode: AccessMode, ticker: String)]
pub struct CreatePool<'info> {
    #[account(
        init, payer = creator, space = BoardingPool::LEN,
        seeds = [b"boarding_pool", token_mint.key().as_ref(), creator.key().as_ref()],
        bump,
    )]
    pub pool: Account<'info, BoardingPool>,

    #[account(
        init, payer = creator,
        token::mint = token_mint, token::authority = token_vault,
        seeds = [b"token_vault", pool.key().as_ref()],
        bump,
    )]
    pub token_vault: Account<'info, TokenAccount>,

    /// CHECK: SOL vault PDA. Validated by seeds.
    #[account(mut, seeds = [b"sol_vault", pool.key().as_ref()], bump)]
    pub sol_vault: SystemAccount<'info>,

    /// Ticker claim PDA — if this ticker already exists, init will fail (duplicate).
    #[account(
        init, payer = creator, space = TickerClaim::LEN,
        seeds = [b"ticker", ticker.as_bytes()],
        bump,
    )]
    pub ticker_claim: Account<'info, TickerClaim>,

    pub token_mint: Account<'info, Mint>,

    #[account(mut, token::mint = token_mint, token::authority = creator)]
    pub creator_token_account: Account<'info, TokenAccount>,

    /// CHECK: Platform treasury receives the non-refundable creation fee.
    #[account(mut)]
    pub platform_treasury: UncheckedAccount<'info>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(
        mut,
        seeds = [b"boarding_pool", pool.token_mint.as_ref(), pool.creator.as_ref()],
        bump = pool.bump,
    )]
    pub pool: Account<'info, BoardingPool>,

    #[account(
        init_if_needed, payer = depositor, space = DepositAccount::LEN,
        seeds = [b"deposit", pool.key().as_ref(), depositor.key().as_ref()],
        bump,
    )]
    pub deposit_account: Account<'info, DepositAccount>,

    /// CHECK: SOL vault PDA. Validated by seeds.
    #[account(mut, seeds = [b"sol_vault", pool.key().as_ref()], bump = pool.sol_vault_bump)]
    pub sol_vault: SystemAccount<'info>,

    /// Optional crew pass — required if pool.access_mode == Crew
    #[account(seeds = [b"crew_pass", pool.key().as_ref(), depositor.key().as_ref()], bump)]
    pub crew_pass: Option<Account<'info, CrewPass>>,

    #[account(mut)]
    pub depositor: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Creator-only actions (pause/unpause)
#[derive(Accounts)]
pub struct CreatorAction<'info> {
    #[account(
        mut,
        seeds = [b"boarding_pool", pool.token_mint.as_ref(), pool.creator.as_ref()],
        bump = pool.bump,
        has_one = creator,
    )]
    pub pool: Account<'info, BoardingPool>,

    #[account(mut)]
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct ManageCrew<'info> {
    #[account(
        seeds = [b"boarding_pool", pool.token_mint.as_ref(), pool.creator.as_ref()],
        bump = pool.bump, has_one = creator,
    )]
    pub pool: Account<'info, BoardingPool>,

    #[account(
        init, payer = creator, space = CrewPass::LEN,
        seeds = [b"crew_pass", pool.key().as_ref(), member.key().as_ref()],
        bump,
    )]
    pub crew_pass: Account<'info, CrewPass>,

    /// CHECK: Wallet being added. No signature needed.
    pub member: UncheckedAccount<'info>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RemoveCrew<'info> {
    #[account(
        seeds = [b"boarding_pool", pool.token_mint.as_ref(), pool.creator.as_ref()],
        bump = pool.bump, has_one = creator,
    )]
    pub pool: Account<'info, BoardingPool>,

    #[account(
        mut, close = creator,
        seeds = [b"crew_pass", pool.key().as_ref(), crew_pass.wallet.as_ref()],
        bump,
    )]
    pub crew_pass: Account<'info, CrewPass>,

    #[account(mut)]
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct Finalize<'info> {
    #[account(
        mut,
        seeds = [b"boarding_pool", pool.token_mint.as_ref(), pool.creator.as_ref()],
        bump = pool.bump,
    )]
    pub pool: Account<'info, BoardingPool>,

    /// Anyone can crank finalization
    pub cranker: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimRefund<'info> {
    #[account(
        seeds = [b"boarding_pool", pool.token_mint.as_ref(), pool.creator.as_ref()],
        bump = pool.bump,
    )]
    pub pool: Account<'info, BoardingPool>,

    #[account(
        mut,
        seeds = [b"deposit", pool.key().as_ref(), depositor.key().as_ref()],
        bump, has_one = depositor, has_one = pool,
    )]
    pub deposit_account: Account<'info, DepositAccount>,

    /// CHECK: SOL vault PDA. Validated by seeds.
    #[account(mut, seeds = [b"sol_vault", pool.key().as_ref()], bump = pool.sol_vault_bump)]
    pub sol_vault: SystemAccount<'info>,

    #[account(mut)]
    pub depositor: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimTokens<'info> {
    #[account(
        seeds = [b"boarding_pool", pool.token_mint.as_ref(), pool.creator.as_ref()],
        bump = pool.bump,
    )]
    pub pool: Account<'info, BoardingPool>,

    #[account(
        mut,
        seeds = [b"deposit", pool.key().as_ref(), depositor.key().as_ref()],
        bump, has_one = depositor, has_one = pool,
    )]
    pub deposit_account: Account<'info, DepositAccount>,

    #[account(mut, seeds = [b"token_vault", pool.key().as_ref()], bump = pool.vault_bump)]
    pub token_vault: Account<'info, TokenAccount>,

    /// Depositor's token account to receive presale tokens
    #[account(mut, token::mint = pool.token_mint, token::authority = depositor)]
    pub depositor_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub depositor: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct LaunchPool<'info> {
    #[account(
        mut,
        seeds = [b"boarding_pool", pool.token_mint.as_ref(), pool.creator.as_ref()],
        bump = pool.bump, has_one = creator,
    )]
    pub pool: Account<'info, BoardingPool>,

    #[account(mut, seeds = [b"token_vault", pool.key().as_ref()], bump = pool.vault_bump)]
    pub token_vault: Account<'info, TokenAccount>,

    /// CHECK: SOL vault PDA. Validated by seeds.
    #[account(mut, seeds = [b"sol_vault", pool.key().as_ref()], bump = pool.sol_vault_bump)]
    pub sol_vault: SystemAccount<'info>,

    /// CHECK: Creator wallet. Validated by has_one.
    #[account(mut)]
    pub creator: UncheckedAccount<'info>,

    /// Creator's token account to receive 5% dev bag
    #[account(mut, token::mint = pool.token_mint, token::authority = creator)]
    pub creator_token_account: Account<'info, TokenAccount>,

    /// CHECK: Platform treasury.
    #[account(mut)]
    pub platform_treasury: UncheckedAccount<'info>,

    pub cranker: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

// ============================================================================
// Events
// ============================================================================

#[event]
pub struct PoolCreated {
    pub pool: Pubkey,
    pub creator: Pubkey,
    pub token_mint: Pubkey,
    pub hard_cap: u64,
    pub per_wallet_cap: u64,
    pub deadline: i64,
}

#[event]
pub struct DepositMade {
    pub pool: Pubkey,
    pub depositor: Pubkey,
    pub amount: u64,
    pub total_deposited: u64,
    pub participant_count: u64,
}

#[event]
pub struct PoolFinalized {
    pub pool: Pubkey,
    pub status: PoolStatus,
    pub total_deposited: u64,
    pub participant_count: u64,
}

#[event]
pub struct RefundClaimed {
    pub pool: Pubkey,
    pub depositor: Pubkey,
    pub amount: u64,
}

#[event]
pub struct PoolPaused {
    pub pool: Pubkey,
}

#[event]
pub struct PoolUnpaused {
    pub pool: Pubkey,
}

#[event]
pub struct EmergencyWithdraw {
    pub pool: Pubkey,
    pub depositor: Pubkey,
    pub amount: u64,
}

#[event]
pub struct CrewMemberAdded {
    pub pool: Pubkey,
    pub wallet: Pubkey,
}

#[event]
pub struct CrewMemberRemoved {
    pub pool: Pubkey,
    pub wallet: Pubkey,
}

#[event]
pub struct PoolLaunched {
    pub pool: Pubkey,
    pub liquidity_sol: u64,
    pub creator_sol: u64,
    pub platform_sol: u64,
    pub creator_tokens: u64,
}

#[event]
pub struct TokensClaimed {
    pub pool: Pubkey,
    pub depositor: Pubkey,
    pub amount: u64,
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum BoardingError {
    #[msg("Hard cap must be > 0")]
    InvalidHardCap,
    #[msg("Per-wallet cap must be > 0 and <= hard cap")]
    InvalidPerWalletCap,
    #[msg("Duration must be 30 min – 72 hours")]
    InvalidDuration,
    #[msg("Token supply must be > 0")]
    InvalidTokenSupply,
    #[msg("Pool is not active")]
    PoolNotActive,
    #[msg("Pool has not expired yet")]
    PoolNotExpired,
    #[msg("Pool has expired")]
    PoolExpired,
    #[msg("Pool is paused")]
    PoolPaused,
    #[msg("Pool is already paused")]
    AlreadyPaused,
    #[msg("Pool is not paused")]
    NotPaused,
    #[msg("Deposit must be > 0")]
    ZeroDeposit,
    #[msg("Exceeds per-wallet cap")]
    ExceedsPerWalletCap,
    #[msg("Exceeds hard cap")]
    ExceedsHardCap,
    #[msg("Threshold not met")]
    ThresholdNotMet,
    #[msg("Threshold met — cannot fail")]
    ThresholdMet,
    #[msg("Pool has not failed")]
    PoolNotFailed,
    #[msg("Already claimed")]
    AlreadyClaimed,
    #[msg("Pool has not succeeded")]
    PoolNotSucceeded,
    #[msg("Pool already launched")]
    AlreadyLaunched,
    #[msg("Not on crew list")]
    NotOnCrewList,
    #[msg("Pool is not crew-gated")]
    PoolNotCrewGated,
    #[msg("30-day emergency timelock not reached")]
    EmergencyTimelockNotReached,
    #[msg("Pool has not launched yet")]
    PoolNotLaunched,
    #[msg("Tokens already claimed")]
    TokensAlreadyClaimed,
    #[msg("Ticker must be 1-10 alphanumeric characters")]
    InvalidTicker,
}
