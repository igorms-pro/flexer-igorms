import { useQuery } from '@tanstack/react-query'
import { getTokenBalancesByChain } from '@lifi/sdk'
import type { Token, TokenAmount } from '@lifi/sdk'
import {THIRTY_SECONDS} from "@/app/constants";

export type UseLifiBalancesProps = {
    walletAddress: string
    tokensByChain: { [chainId: number]: Token[] }
    enabled?: boolean
}

export const useLifiBalances = ({
                                    walletAddress,
                                    tokensByChain,
                                    enabled = true,
                                }: UseLifiBalancesProps) => {
    const {
        data,
        isLoading,
        isFetched,
        error,
    } = useQuery({
        queryKey: ['lifi-balances', walletAddress, tokensByChain],
        queryFn: () => getTokenBalancesByChain(walletAddress, tokensByChain),
        enabled: Boolean(walletAddress && Object.keys(tokensByChain).length) && enabled,
        staleTime: THIRTY_SECONDS,
        retry: false,
    })

    return {
        balancesByChain: data as { [chainId: number]: TokenAmount[] } | undefined,
        isLoading,
        isFetched,
        error,
    }
}
