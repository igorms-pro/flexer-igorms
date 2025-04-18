export function formatBalance(balance: string, decimals: number = 6): string {
    const ethBalance = parseFloat(balance) / Math.pow(10, 18);
    return ethBalance.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: decimals});
}
