import type { CollectionEntry } from 'astro:content'

export interface PortfolioStats {
    totalProfitLoss: number
    totalTrades: number // Number of closed trades (sells)
    winRate: number
    profitFactor: number
    winningTrades: number
    losingTrades: number
}

interface Holding {
    quantity: number
    avgCost: number
}

// Helper to format currency (optional usage)
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}

export function calculatePortfolioStats(
    trades: CollectionEntry<'trades'>[]
): PortfolioStats {
    // Sort trades by date ascending to ensure correct chronological processing
    const sortedTrades = [...trades].sort(
        (a, b) => a.data.date.getTime() - b.data.date.getTime()
    )

    const holdings = new Map<string, Holding>()
    let totalRealizedPL = 0
    let grossProfit = 0
    let grossLoss = 0
    let winningTrades = 0
    let losingTrades = 0

    for (const trade of sortedTrades) {
        const { ticker, type, price, quantity } = trade.data
        const currentHolding = holdings.get(ticker) || { quantity: 0, avgCost: 0 }

        if (type === 'Buy') {
            // Calculate new weighted average cost
            // New Avg = ((Old Qty * Old Avg) + (Buy Qty * Buy Price)) / (Old Qty + Buy Qty)
            const totalCost =
                currentHolding.quantity * currentHolding.avgCost + quantity * price
            const newQuantity = currentHolding.quantity + quantity
            const newAvgCost = newQuantity > 0 ? totalCost / newQuantity : 0

            holdings.set(ticker, {
                quantity: newQuantity,
                avgCost: newAvgCost
            })
        } else if (type === 'Sell') {
            // Calculate Realized P/L for this transaction
            // P/L = (Sell Price - Avg Cost) * Sell Qty
            if (currentHolding.quantity > 0) {
                // Assume FIFO or Average Cost - here using Average Cost as tracking specific lots is complex
                // We only sell what we have. If selling more than owned, we handle what we can (or assume data integrity)
                const qtyToSell = Math.min(quantity, currentHolding.quantity)
                const tradePL = (price - currentHolding.avgCost) * qtyToSell

                totalRealizedPL += tradePL

                if (tradePL > 0) {
                    grossProfit += tradePL
                    winningTrades++
                } else if (tradePL < 0) {
                    grossLoss += Math.abs(tradePL)
                    losingTrades++
                }
                // If 0, it's neutral, typically doesn't count as win or loss in some stats,
                // but let's count it as a trade.

                // Update holding quantity
                const remainingQty = currentHolding.quantity - qtyToSell
                // AvgCost stays the same when selling
                holdings.set(ticker, {
                    quantity: remainingQty,
                    avgCost: currentHolding.avgCost
                })
            }
        }
    }

    const totalTrades = winningTrades + losingTrades
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 100 : 0 // Handle div by 0

    return {
        totalProfitLoss: totalRealizedPL,
        totalTrades: totalTrades,
        winRate: winRate,
        profitFactor: profitFactor,
        winningTrades,
        losingTrades
    }
}
