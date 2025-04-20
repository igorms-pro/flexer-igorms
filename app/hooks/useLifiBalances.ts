'use client'

import {useQuery} from '@tanstack/react-query'
import {getTokenBalance, type Token, type TokenAmount} from '@lifi/sdk'
import {POPULAR_TOKEN_SYMBOLS, SOLANA_LIFI_CHAIN_ID, THIRTY_SECONDS} from '@/app/constants'
import {patchTokensForLifi} from '@/app/utils/lifi'
import {useConnection} from '@solana/wallet-adapter-react'
import {PublicKey} from '@solana/web3.js'

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
    const {connection} = useConnection()

    const queryKey = ['lifi-individual-balances', evmAddress, solanaAddress, tokensByChain]

    const queryFn = async (): Promise<{ [chainId: number]: TokenAmount[] }> => {
        const balances: { [chainId: number]: TokenAmount[] } = {}
        const patchedTokens = patchTokensForLifi(tokensByChain)

        // --- EVM Tokens ---
        if (evmAddress) {
            const filteredEvmTokens = Object.entries(patchedTokens)
                .filter(([chainId]) => Number(chainId) !== SOLANA_LIFI_CHAIN_ID)
                .flatMap(([chainIdStr, tokens]) =>
                    tokens
                        .filter((t) => POPULAR_TOKEN_SYMBOLS.includes(t.symbol))
                        .map((token) => ({chainId: Number(chainIdStr), token}))
                )

            for (const {chainId, token} of filteredEvmTokens) {
                try {
                    const balance = await getTokenBalance(evmAddress, token)
                    if (balance) {
                        if (!balances[chainId]) balances[chainId] = []
                        balances[chainId].push(balance)
                    }
                } catch {
                    // silent fail
                }
            }
        }

        // --- Solana Token ---
        if (solanaAddress) {
            try {
                const solBalanceLamports = await connection.getBalance(new PublicKey(solanaAddress))
                const solAmount = solBalanceLamports / 1e9

                const solToken = await fetch(
                    'https://li.quest/v1/token?chain=1151111081099710&token=SOL'
                ).then((res) => res.json())

                const solTokenAmount: TokenAmount = {
                    address: solToken.address,
                    chainId: solToken.chainId,
                    symbol: solToken.symbol,
                    decimals: solToken.decimals,
                    name: solToken.name,
                    coinKey: solToken.coinKey,
                    logoURI: solToken.logoURI,
                    priceUSD: solToken.priceUSD,
                    amount: BigInt(Math.floor(solAmount * 1e9)),
                }

                balances[solToken.chainId] = [solTokenAmount]
            } catch {
                // silent fail
            }
        }

        return balances
    }

    const {data, isLoading, isFetched, error, refetch} = useQuery({
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
        refetch,
    }
}
