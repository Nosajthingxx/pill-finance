// Portfolio P/L engine -- pure functions, no DB calls.
// Takes a list of transactions, returns position state and totals.
// See docs/13-user-system-and-portfolio.md "P/L engine" for the algorithm spec.

import type { Transaction, TransactionSide } from '@/db/schema';

// ─── Types ──────────────────────────────────────────────────────────────

/** State of a single asset's position, computed from transactions. */
export interface PositionState {
  assetSlug: string;
  netQty: number;          // signed: positive = long, negative = short
  avgCostUsd: number;      // weighted average cost of OPEN portion (positive number)
  realizedPlUsd: number;   // cumulative realized P/L
  lastTransactionDate: string | null;
}

/** Position augmented with current-price-based fields. */
export interface PositionWithPL extends PositionState {
  currentPriceUsd: number;
  marketValueUsd: number;       // |netQty| * currentPrice
  costBasisUsd: number;          // |netQty| * avgCost
  unrealizedPlUsd: number;
  unrealizedPlPct: number | null; // null when avgCost is 0 (e.g., closed position)
  totalPlUsd: number;            // realized + unrealized
}

/** Portfolio-wide totals. */
export interface PortfolioTotals {
  totalCostBasis: number;
  totalMarketValue: number;
  totalUnrealizedPl: number;
  totalRealizedPl: number;
  totalPl: number;
  totalPlPct: number | null;   // null if no open positions
  openPositionCount: number;
}

// ─── Validation: can this transaction be appended? ──────────────────────

export type TransactionInput = {
  assetSlug: string;
  side: TransactionSide;
  quantity: number;        // positive
  priceUsd: number;        // non-negative
  transactionDate: string; // YYYY-MM-DD
};

export type ValidationOk = { ok: true };
export type ValidationError = { ok: false; reason: string; code: string };
export type ValidationResult = ValidationOk | ValidationError;

/**
 * Check whether `next` is a valid transaction given the user's PRIOR transactions
 * (in chronological order). Does not enforce uniqueness -- that's a DB concern.
 *
 * Rules (per spec):
 *  - buy: must not be applied to a short position (use short_close instead)
 *  - sell: must not exceed current long quantity; partial-sell allowed (sellQty <= netQty)
 *  - short_open: must not be applied to a long position
 *  - short_close: must not exceed current short quantity
 *  - All quantities must be positive; priceUsd must be >= 0
 */
export function validateTransaction(
  priorTransactions: Transaction[],
  next: TransactionInput
): ValidationResult {
  if (next.quantity <= 0) {
    return { ok: false, code: 'NON_POSITIVE_QTY', reason: 'Quantity must be greater than zero.' };
  }
  if (next.priceUsd < 0) {
    return { ok: false, code: 'NEGATIVE_PRICE', reason: 'Price cannot be negative.' };
  }

  // Compute current state for this asset
  const priorForAsset = priorTransactions.filter((t) => t.assetSlug === next.assetSlug);
  const state = computePositionFromTransactions(next.assetSlug, priorForAsset);

  switch (next.side) {
    case 'buy':
      if (state.netQty < 0) {
        return {
          ok: false,
          code: 'BUY_WHILE_SHORT',
          reason: 'You currently have a short position. Close the short before going long.',
        };
      }
      return { ok: true };

    case 'sell':
      if (state.netQty <= 0) {
        return {
          ok: false,
          code: 'SELL_WITHOUT_LONG',
          reason: 'You have no long position to sell.',
        };
      }
      if (next.quantity > state.netQty + 1e-9) {
        return {
          ok: false,
          code: 'SELL_OVER_QTY',
          reason: `You only hold ${state.netQty} units. Reduce the quantity or close the position in steps.`,
        };
      }
      return { ok: true };

    case 'short_open':
      if (state.netQty > 0) {
        return {
          ok: false,
          code: 'SHORT_WHILE_LONG',
          reason: 'You currently have a long position. Sell it first before opening a short.',
        };
      }
      return { ok: true };

    case 'short_close':
      if (state.netQty >= 0) {
        return {
          ok: false,
          code: 'CLOSE_WITHOUT_SHORT',
          reason: 'You have no short position to close.',
        };
      }
      if (next.quantity > -state.netQty + 1e-9) {
        return {
          ok: false,
          code: 'CLOSE_OVER_QTY',
          reason: `You are short ${-state.netQty} units. Reduce the quantity.`,
        };
      }
      return { ok: true };
  }
}

// ─── Core: compute a single asset's position from its transactions ──────

/**
 * Walk the asset's transactions in chronological order and return the final state.
 * Algorithm matches docs/13 "P/L engine" pseudocode.
 *
 * Caller is responsible for sorting (we sort here too, defensively).
 */
export function computePositionFromTransactions(
  assetSlug: string,
  transactions: Transaction[]
): PositionState {
  const sorted = [...transactions].sort((a, b) => {
    const cmp = a.transactionDate.localeCompare(b.transactionDate);
    if (cmp !== 0) return cmp;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  let netQty = 0;
  let avgCost = 0;
  let realizedPl = 0;
  let lastDate: string | null = null;

  for (const tx of sorted) {
    const qty = Number(tx.quantity);
    const price = Number(tx.priceUsd);
    lastDate = tx.transactionDate;

    switch (tx.side) {
      case 'buy': {
        if (netQty < 0) {
          // Defensive: validateTransaction should have prevented this.
          // Treat as a covering buy on the short.
          const coverQty = Math.min(qty, -netQty);
          realizedPl += (avgCost - price) * coverQty;
          netQty += coverQty;
          const remainingBuy = qty - coverQty;
          if (remainingBuy > 0) {
            // After covering, the rest opens a long
            avgCost = price;
            netQty = remainingBuy;
          } else if (netQty === 0) {
            avgCost = 0;
          }
        } else {
          // Standard buy: weighted average cost across all open long lots
          const newQty = netQty + qty;
          avgCost = newQty > 0 ? (avgCost * netQty + price * qty) / newQty : 0;
          netQty = newQty;
        }
        break;
      }

      case 'sell': {
        const sellQty = Math.min(qty, netQty);
        realizedPl += (price - avgCost) * sellQty;
        netQty -= sellQty;
        if (netQty === 0) avgCost = 0;
        // If qty > netQty (validateTransaction should prevent), the overflow is dropped.
        break;
      }

      case 'short_open': {
        if (netQty > 0) {
          // Defensive: close the long first, then short the rest
          const closeQty = Math.min(qty, netQty);
          realizedPl += (price - avgCost) * closeQty;
          netQty -= closeQty;
          if (netQty === 0) avgCost = 0;
          const remainingShort = qty - closeQty;
          if (remainingShort > 0) {
            avgCost = price;
            netQty = -remainingShort;
          }
        } else {
          // Standard short open: weighted average cost across all open short lots
          const currentShortQty = -netQty;
          const newShortQty = currentShortQty + qty;
          avgCost = newShortQty > 0 ? (avgCost * currentShortQty + price * qty) / newShortQty : 0;
          netQty = -newShortQty;
        }
        break;
      }

      case 'short_close': {
        const closeQty = Math.min(qty, -netQty);
        realizedPl += (avgCost - price) * closeQty;
        netQty += closeQty;
        if (netQty === 0) avgCost = 0;
        break;
      }
    }
  }

  return {
    assetSlug,
    netQty: round8(netQty),
    avgCostUsd: round8(Math.max(0, avgCost)),
    realizedPlUsd: round8(realizedPl),
    lastTransactionDate: lastDate,
  };
}

// ─── Public API: compute all positions and totals for a user ────────────

/**
 * Take a flat list of a user's transactions (all assets, all dates) and a price
 * map, and return per-asset positions plus portfolio totals.
 *
 * @param transactions  All of the user's transactions
 * @param prices        Map of assetSlug -> current price in USD
 */
export function computePortfolio(
  transactions: Transaction[],
  prices: Record<string, number>
): { positions: PositionWithPL[]; totals: PortfolioTotals } {
  // Group transactions by asset
  const byAsset = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const list = byAsset.get(tx.assetSlug) ?? [];
    list.push(tx);
    byAsset.set(tx.assetSlug, list);
  }

  const positions: PositionWithPL[] = [];
  let totalCostBasis = 0;
  let totalMarketValue = 0;
  let totalUnrealizedPl = 0;
  let totalRealizedPl = 0;
  let openCount = 0;

  for (const [assetSlug, txs] of byAsset) {
    const state = computePositionFromTransactions(assetSlug, txs);
    const currentPrice = prices[assetSlug] ?? 0;
    const absQty = Math.abs(state.netQty);
    const costBasis = absQty * state.avgCostUsd;
    let unrealizedPl = 0;
    let marketValue = 0;
    if (state.netQty > 0) {
      // Long: market value = qty * current price, P/L = (current - avg) * qty
      marketValue = absQty * currentPrice;
      unrealizedPl = (currentPrice - state.avgCostUsd) * absQty;
    } else if (state.netQty < 0) {
      // Short: market value (notional exposure) = qty * current price
      // P/L = (avg - current) * qty (positive when price drops below avg)
      marketValue = absQty * currentPrice;
      unrealizedPl = (state.avgCostUsd - currentPrice) * absQty;
    }
    const unrealizedPlPct =
      state.avgCostUsd > 0 ? unrealizedPl / (state.avgCostUsd * absQty) : null;

    positions.push({
      ...state,
      currentPriceUsd: currentPrice,
      marketValueUsd: round8(marketValue),
      costBasisUsd: round8(costBasis),
      unrealizedPlUsd: round8(unrealizedPl),
      unrealizedPlPct: unrealizedPlPct !== null ? round8(unrealizedPlPct) : null,
      totalPlUsd: round8(state.realizedPlUsd + unrealizedPl),
    });

    if (state.netQty !== 0) openCount++;
    totalCostBasis += costBasis;
    totalMarketValue += marketValue;
    totalUnrealizedPl += unrealizedPl;
    totalRealizedPl += state.realizedPlUsd;
  }

  // Sort: open positions first (by market value desc), then closed (alphabetical)
  positions.sort((a, b) => {
    if ((a.netQty === 0) !== (b.netQty === 0)) {
      return a.netQty === 0 ? 1 : -1;
    }
    if (a.netQty !== 0 && b.netQty !== 0) {
      return b.marketValueUsd - a.marketValueUsd;
    }
    return a.assetSlug.localeCompare(b.assetSlug);
  });

  const totalPl = totalRealizedPl + totalUnrealizedPl;
  const totalPlPct = totalCostBasis > 0 ? totalUnrealizedPl / totalCostBasis : null;

  return {
    positions,
    totals: {
      totalCostBasis: round8(totalCostBasis),
      totalMarketValue: round8(totalMarketValue),
      totalUnrealizedPl: round8(totalUnrealizedPl),
      totalRealizedPl: round8(totalRealizedPl),
      totalPl: round8(totalPl),
      totalPlPct: totalPlPct !== null ? round8(totalPlPct) : null,
      openPositionCount: openCount,
    },
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────

function round8(n: number): number {
  // Round to 8 decimal places to match DB column precision and avoid float artifacts.
  return Math.round(n * 1e8) / 1e8;
}
