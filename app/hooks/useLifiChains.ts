import { useQuery } from '@tanstack/react-query'
import type { ExtendedChain } from '@lifi/sdk'
import { ChainType, getChains } from '@lifi/sdk'
import { FIVE_MINUTES } from '../constants'

export type UseLifiChainsProps = {
    chainTypes?: ChainType[]
}

export const useLifiChains = ({ chainTypes = [ChainType.EVM, ChainType.SVM] }: UseLifiChainsProps = {}) => {
    const {
        data,
        isLoading,
        isFetched,
        error,
    } = useQuery<ExtendedChain[]>({
        queryKey: ['lifi-chains', chainTypes],
        queryFn: () => getChains({ chainTypes }),
        staleTime: FIVE_MINUTES,
        retry: false,
    })

    return {
        chains: data,
        isLoading,
        isFetched,
        error,
    }
}
