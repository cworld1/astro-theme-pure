import type { CollectionEntry } from 'astro:content'

export interface PortfolioStats {
    totalProfitLoss: number
    totalTrades: number
    winRate: number
    profitFactor: number
    winningTrades: number
    losingTrades: number
    averagePL: number
}

export interface EquityPoint {
    date: string // ISO string YYYY-MM-DD
    value: number
    tooltip?: string // Optional info for the point
}

interface Holding {
    quantity: number
    avgCost: number
}

// Format Helper
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}

/**
 * Core function to calculate all portfolio metrics
 */
export function calculatePortfolioStats(
    trades: CollectionEntry<'trades'>[]
): PortfolioStats {
    const { totalRealizedPL, winningTrades, losingTrades, grossProfit, grossLoss } = processTrades(trades)

    const totalTrades = winningTrades + losingTrades
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0
    const averagePL = totalTrades > 0 ? totalRealizedPL / totalTrades : 0

    return {
        totalProfitLoss: totalRealizedPL,
        totalTrades,
        winRate,
        profitFactor,
        winningTrades,
        losingTrades,
        averagePL
    }
}

/**
 * Generate Equity Curve (Cumulative P/L over time)
 */
export function calculateEquityCurve(
    trades: CollectionEntry<'trades'>[]
): EquityPoint[] {
    const sortedTrades = [...trades].sort(
        (a, b) => a.data.date.getTime() - b.data.date.getTime()
    )

    const holdings = new Map<string, Holding>()


    // Initialize with a starting point
    // To handle multiple trades on same day, we map by date first
    const dailyPL = new Map<string, number>()
    // Add initial point
    // curve.push({ date: new Date(startTimestamp - 86400000).toISOString().split('T')[0], value: 0 })

    for (const trade of sortedTrades) {
        const { ticker, type, price, quantity, date } = trade.data
        const dateStr = date.toISOString().split('T')[0]

        // Ensure we have a holding record
        const currentHolding = holdings.get(ticker) || { quantity: 0, avgCost: 0 }

        if (type === 'Buy') {
            // Update Weighted Average Cost
            const totalCost = currentHolding.quantity * currentHolding.avgCost + quantity * price
            const newQuantity = currentHolding.quantity + quantity
            const newAvgCost = newQuantity > 0 ? totalCost / newQuantity : 0

            holdings.set(ticker, { quantity: newQuantity, avgCost: newAvgCost })
        } else if (type === 'Sell') {
            // Calculate P/L
            if (currentHolding.quantity > 0) {
                const qtyToSell = Math.min(quantity, currentHolding.quantity)
                const tradePL = (price - currentHolding.avgCost) * qtyToSell

                // Update holdings
                holdings.set(ticker, {
                    quantity: currentHolding.quantity - qtyToSell,
                    avgCost: currentHolding.avgCost
                })

                // Record the NEW cumulative total for this day
                // Note: This logic assumes we want the Closing cumulative PL for that day.
                // Simple approach: Store the delta in dailyMap, then sum up later?
                // Or just update the 'currentCumulativePL' state and push?
                // Let's use the daily map to store the 'Cumulative P/L at end of day'.
                // Actually, simpler: Map date -> daily realized P/L change. Then run aggregation.
                const dayChange = dailyPL.get(dateStr) || 0
                dailyPL.set(dateStr, dayChange + tradePL)
            }
        }
    }

    // Reconstruct curve from daily changes
    // Sort dates
    const sortedDates = Array.from(dailyPL.keys()).sort()

    let runningTotal = 0
    const points: EquityPoint[] = []

    // Ensure we start from the first trade date or slightly before
    if (sortedDates.length > 0) {
        // Optional: Start at 0
        // points.push({ date: 'Start', value: 0 })
    }

    for (const date of sortedDates) {
        runningTotal += dailyPL.get(date)!
        points.push({
            date,
            value: parseFloat(runningTotal.toFixed(2))
        })
    }

    return points
}


// Internal helper to avoid code duplication
function processTrades(trades: CollectionEntry<'trades'>[]) {
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
            const totalCost = currentHolding.quantity * currentHolding.avgCost + quantity * price
            const newQuantity = currentHolding.quantity + quantity
            const newAvgCost = newQuantity > 0 ? totalCost / newQuantity : 0
            holdings.set(ticker, { quantity: newQuantity, avgCost: newAvgCost })
        } else if (type === 'Sell') {
            if (currentHolding.quantity > 0) {
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
                holdings.set(ticker, {
                    quantity: currentHolding.quantity - qtyToSell,
                    avgCost: currentHolding.avgCost
                })
            }
        }
    }
    return { totalRealizedPL, winningTrades, losingTrades, grossProfit, grossLoss }
}
