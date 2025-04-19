import {renderHook} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {useUsdBalanceSnapshot} from '../useUsdBalanceSnapshot'
import {formatUnits} from 'viem'
import {formatUsd} from "@/app/utils/balance";

vi.mock('@/app/hooks/useWalletAddresses', () => ({
    useWalletAddresses: () => ({
        evmAddress: '0x123',
        solanaAddress: null,
    }),
}))

vi.mock('@/app/hooks/useLifiTokens', () => ({
    useLifiTokens: () => ({
        tokens: {
            1: [
                {
                    address: '0xeth',
                    chainId: 1,
                    symbol: 'ETH',
                    decimals: 18,
                    priceUSD: '2000',
                },
            ],
        },
        isFetched: true,
    }),
}))

vi.mock('@/app/hooks/useLifiBalances', () => ({
    useLifiBalances: () => ({
        balancesByChain: {
            1: [
                {
                    chainId: 1,
                    address: '0xeth',
                    symbol: 'ETH',
                    decimals: 18,
                    priceUSD: '2000',
                    amount: BigInt('500000000000000000'), // 0.5 ETH
                },
            ],
        },
        isLoading: false,
        refetch: vi.fn(),
    }),
}))

describe('useUsdBalanceSnapshot (hook)', () => {
    it('calculates totalUsd and message correctly', () => {
        const {result} = renderHook(() => useUsdBalanceSnapshot())

        const expectedUsd = parseFloat(formatUnits(BigInt('500000000000000000'), 18)) * 2000 // 0.5 * 2000
        expect(result.current.totalUsd).toBeCloseTo(expectedUsd)
        expect(result.current.message).toBe(`Balance: ${formatUsd(expectedUsd)}`);
        expect(result.current.isLoading).toBe(false)
    })

    // TODO
    // it('returns 0 when balances are not available', () => {
    //     // @ts-expect-error
    //     vi.mocked(require('@/app/hooks/useLifiBalances').useLifiBalances).mockReturnValueOnce({
    //         balancesByChain: {},
    //         isLoading: false,
    //         refetch: vi.fn(),
    //     })
    //
    //     const {result} = renderHook(() => useUsdBalanceSnapshot())
    //
    //     expect(result.current.totalUsd).toBe(0)
    //     expect(result.current.message).toBe('Balance: $0.00')
    // })
})
