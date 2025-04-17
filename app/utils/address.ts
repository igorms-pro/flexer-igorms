export function shortenAddress(
    address: string,
    options: { start?: number; end?: number } = {}
): string {
    const {start = 6, end = 4} = options
    if (address.length <= start + end) return address
    return `${address.slice(0, start)}…${address.slice(-end)}`
}