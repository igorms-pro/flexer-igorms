import {useMemo} from 'react';
import {formatUsd} from '@/app/utils/balance';
import {useLifiBalances} from '@/app/hooks/useLifiBalances';
import {useWalletAddresses} from '@/app/hooks/useWalletAddresses';
import {useLifiTokens} from '@/app/hooks/useLifiTokens';
import {formatUnits} from 'viem';

export type TooltipBalanceRow = {
    chainId: number;
    token: string;
    balance: string;
    price: string;
    total: string;
};

export const useUsdBalanceSnapshot = () => {
    const {evmAddress, solanaAddress} = useWalletAddresses();
    const {tokens, isFetched: tokensFetched} = useLifiTokens();

    const {balancesByChain, isLoading, refetch} = useLifiBalances({
        evmAddress,
        solanaAddress,
        tokensByChain: tokens,
    });

    const {totalUsd, rows} = useMemo(() => {
        if (!balancesByChain || !tokensFetched) {
            return {totalUsd: 0, rows: []};
        }

        let sum = 0;
        const formattedRows: TooltipBalanceRow[] = [];

        Object.entries(balancesByChain).forEach(([chainIdStr, tokenArray]) => {
            const chainId = Number(chainIdStr);
            const filtered = tokenArray.filter(({amount}) => amount !== undefined && amount > BigInt(0));
            if (filtered.length === 0) return;

            filtered.forEach(({symbol, amount, priceUSD, decimals}) => {
                const parsed = parseFloat(formatUnits(amount!, decimals));
                const price = parseFloat(priceUSD || '0');
                const usd = parsed * price;

                formattedRows.push({
                    chainId,
                    token: symbol || 'Unknown',
                    balance: parsed.toFixed(4),
                    price: `$${price.toFixed(2)}`,
                    total: `$${usd.toFixed(2)}`,
                });

                sum += usd;
            });
        });

        return {
            totalUsd: sum,
            rows: formattedRows,
        };
    }, [balancesByChain, tokensFetched]);

    const message = useMemo(() => {
        if (!evmAddress && !solanaAddress) return 'Please connect a wallet';
        const formatted = formatUsd(totalUsd);
        return `Balance: ${formatted}`;
    }, [totalUsd, evmAddress, solanaAddress]);

    return {
        totalUsd,
        message,
        isLoading,
        refresh: refetch,
        tooltipTableRows: rows,
    };
};
