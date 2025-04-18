import type {Token} from '@lifi/types'
import {CoinKey} from '@lifi/types'
import {NATIVE_TOKEN_ADDRESS} from '@/app/constants'

export function patchTokensForLifi(tokensByChain: { [chainId: number]: Token[] }) {
    const patched: { [chainId: number]: Token[] } = {}

    for (const [chainIdStr, tokens] of Object.entries(tokensByChain)) {
        const chainId = Number(chainIdStr)
        patched[chainId] = tokens.map((token) => {
            const isNative =
                (chainId === 1 && token.symbol === 'ETH') ||
                (chainId === 137 && token.symbol === 'MATIC') ||
                (chainId === 56 && token.symbol === 'BNB')

            if (isNative) {
                return {
                    ...token,
                    address: NATIVE_TOKEN_ADDRESS,
                    coinKey: token.symbol as CoinKey,
                }
            }

            return token
        })
    }

    return patched
}
