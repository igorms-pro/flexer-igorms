import {useMemo} from 'react';
import {formatUsd} from '@/app/utils/balance';
import {useLifiBalances} from '@/app/hooks/useLifiBalances';
import {useWalletAddresses} from '@/app/hooks/useWalletAddresses';
import {useLifiTokens} from '@/app/hooks/useLifiTokens';
import {formatUnits} from 'viem';
import type {TokenAmount} from '@lifi/sdk';

export const useUsdBalanceSnapshot = () => {
    const {evmAddress, solanaAddress} = useWalletAddresses();

    const {tokens, isFetched: tokensFetched} = useLifiTokens();

    const {balancesByChain, isLoading, refetch} = useLifiBalances({
        evmAddress,
        solanaAddress,
        tokensByChain: tokens,
    });

    const totalUsd = useMemo(() => {
        if (!balancesByChain || !tokensFetched) return 0;

        let sum = 0;

        Object.values(balancesByChain).forEach((tokenArray: TokenAmount[]) => {
            tokenArray.forEach(({amount, priceUSD, decimals}) => {
                if (priceUSD && amount !== undefined) {
                    const parsed = parseFloat(formatUnits(amount, decimals));
                    sum += parsed * parseFloat(priceUSD);
                }
            });
        });

        return sum;
    }, [balancesByChain, tokensFetched]);

    const message = useMemo(() => {
        return `Balance: $${formatUsd(totalUsd)}`;
    }, [totalUsd]);

    return {
        totalUsd,
        message,
        isLoading,
        refresh: refetch,
    };
};
