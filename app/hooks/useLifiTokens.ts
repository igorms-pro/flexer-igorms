import { useQuery } from '@tanstack/react-query'
import { getTokens, ChainType, type TokensResponse, type ChainId } from '@lifi/sdk'
import { FIVE_MINUTES } from '../constants'

export type UseLifiTokensProps = {
    chainTypes?: ChainType[]
    chains?: ChainId[]
}

export const useLifiTokens = ({
                                  chainTypes = [ChainType.EVM, ChainType.SVM],
                                  chains,
                              }: UseLifiTokensProps = {}) => {
    const {
        data,
        isLoading,
        isFetched,
        error,
    } = useQuery<TokensResponse>({
        queryKey: ['lifi-tokens', chainTypes, chains],
        queryFn: () => getTokens({ chainTypes, chains }),
        staleTime: FIVE_MINUTES,
        refetchInterval: FIVE_MINUTES,
        retry: false,
    })

    return {
        tokens: data?.tokens,
        isLoading,
        isFetched,
        error,
    }
}
