import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {beforeEach, describe, expect, test, vi} from 'vitest'
import {renderHook, waitFor} from '@testing-library/react'
import {useLifiTokens} from '../useLifiTokens'
import {getTokens} from '@lifi/sdk'
import React from 'react'

vi.mock('@lifi/sdk', async () => {
    const actual = await vi.importActual('@lifi/sdk')
    return {
        ...actual,
        getTokens: vi.fn(),
    }
})

const queryClient = new QueryClient()
const wrapper = (props: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, {client: queryClient}, props.children)

describe('useLifiTokens', () => {
    beforeEach(() => {
        queryClient.clear()
        ;(getTokens as ReturnType<typeof vi.fn>).mockReset()
    })

    test('should return list of tokens by chain', async () => {
        ;(getTokens as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            tokens: {
                1: [
                    {
                        address: '0xETH',
                        chainId: 1,
                        symbol: 'ETH',
                        decimals: 18,
                        name: 'Ethereum',
                        priceUSD: '2000',
                    },
                ],
            },
        })

        ;(getTokens as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            tokens: {
                137: [
                    {
                        address: '0xMATIC',
                        chainId: 137,
                        symbol: 'MATIC',
                        decimals: 18,
                        name: 'Polygon',
                        priceUSD: '1',
                    },
                ],
            },
        })

        const {result} = renderHook(() => useLifiTokens(), {wrapper})

        await waitFor(() => result.current.tokens?.[1]?.length)

        expect(result.current.tokens?.[1]?.[0]?.symbol).toBe('ETH')
        expect(result.current.tokens?.[137]?.[0]?.symbol).toBe('MATIC')
    })
})
