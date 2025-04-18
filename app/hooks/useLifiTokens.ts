import { useQueries } from '@tanstack/react-query'
import { getTokens, type ChainId, type ChainType } from '@lifi/sdk'
import { FIVE_MINUTES, POPULAR_EVM_CHAINS, SOLANA_LIFI_CHAIN_ID } from '@/app/constants'

export type UseLifiTokensProps = {
    chains?: ChainId[]
    chainTypes?: ChainType[]
}

export const useLifiTokens = ({ chains, chainTypes }: UseLifiTokensProps = {}) => {
    const effectiveChains = chains ?? [...POPULAR_EVM_CHAINS, SOLANA_LIFI_CHAIN_ID]

    const evmChains = effectiveChains.filter((id) => id !== SOLANA_LIFI_CHAIN_ID)
    const solanaChains = effectiveChains.includes(SOLANA_LIFI_CHAIN_ID)
        ? [SOLANA_LIFI_CHAIN_ID]
        : []

    const queries = useQueries({
        queries: [
            {
                queryKey: ['lifi-tokens', 'evm', chainTypes],
                queryFn: () => getTokens({ chains: evmChains, chainTypes }),
                enabled: evmChains.length > 0,
                staleTime: FIVE_MINUTES,
                refetchInterval: FIVE_MINUTES,
                retry: false,
            },
            {
                queryKey: ['lifi-tokens', 'svm', chainTypes],
                queryFn: () => getTokens({ chains: solanaChains, chainTypes }),
                enabled: solanaChains.length > 0,
                staleTime: FIVE_MINUTES,
                refetchInterval: FIVE_MINUTES,
                retry: false,
            },
        ],
    })

    const [evmQuery, solanaQuery] = queries

    const tokens = {
        ...(evmQuery.data?.tokens || {}),
        ...(solanaQuery.data?.tokens || {}),
    }

    return {
        tokens,
        isLoading: evmQuery.isLoading || solanaQuery.isLoading,
        isFetched: evmQuery.isFetched && solanaQuery.isFetched,
        error: evmQuery.error || solanaQuery.error,
    }
}
