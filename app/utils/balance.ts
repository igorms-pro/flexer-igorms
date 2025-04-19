export function formatBalance(balance: string, decimals: number = 6): string {
    const ethBalance = parseFloat(balance) / Math.pow(10, 18);
    return ethBalance.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: decimals});
}

export function formatUsd(value: number): string {
    return value.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}