'use client'

import {useQuery} from '@tanstack/react-query'
import type {Token, TokenAmount} from '@lifi/sdk'
import {getTokenBalance} from '@lifi/sdk'
import {THIRTY_SECONDS} from '@/app/constants'
import {patchTokensForLifi} from '@/app/utils/lifi'

export type UseLifiBalancesProps = {
    evmAddress?: string
    solanaAddress?: string
    tokensByChain: { [chainId: number]: Token[] }
    enabled?: boolean
}

export const useLifiBalances = ({
                                    evmAddress,
                                    solanaAddress,
                                    tokensByChain,
                                    enabled = true,
                                }: UseLifiBalancesProps) => {
    const queryKey = ['lifi-individual-balances', evmAddress, solanaAddress, tokensByChain]

    const queryFn = async (): Promise<{ [chainId: number]: TokenAmount[] }> => {
        const balances: { [chainId: number]: TokenAmount[] } = {}

        const address = evmAddress || solanaAddress
        if (!address) return balances

        const patchedTokens = patchTokensForLifi(tokensByChain)
        const tokensToCheck = Object.entries(patchedTokens).flatMap(([chainIdStr, tokens]) =>
            tokens.map((token) => ({chainId: Number(chainIdStr), token}))
        )

        for (const {chainId, token} of tokensToCheck) {
            if (chainId === 1 && token.symbol === 'ETH') {
                try {
                    const balance = await getTokenBalance(address, token)
                    if (balance) {
                        if (!balances[chainId]) {
                            balances[chainId] = []
                        }
                        balances[chainId].push(balance)
                    }
                } catch (err) {
                    console.warn('[useLifiBalances][ETH] error:', err)
                }
            }
        }

        return balances
    }

    const {data, isLoading, isFetched, error} = useQuery({
        queryKey,
        queryFn,
        enabled: Boolean(
            enabled &&
            (evmAddress || solanaAddress) &&
            Object.keys(tokensByChain).length > 0
        ),
        staleTime: THIRTY_SECONDS,
        retry: false,
    })

    return {
        balancesByChain: data as { [chainId: number]: TokenAmount[] },
        isLoading,
        isFetched,
        error,
    }
}
