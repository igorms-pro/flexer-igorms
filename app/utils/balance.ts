import {formatUnits} from 'viem';

export function formatBalance(balance: bigint | string, decimals: number = 18, displayDecimals = 6): string {
    const value = parseFloat(formatUnits(BigInt(balance), decimals));
    return value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: displayDecimals,
    });
}

export function formatUsd(value: number): string {
    return value.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}