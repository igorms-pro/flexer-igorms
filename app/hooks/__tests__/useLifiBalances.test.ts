import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {describe, expect, test, vi} from 'vitest'
import {renderHook} from '@testing-library/react'
import {useLifiBalances} from '../useLifiBalances'
import React from 'react'

vi.mock('@lifi/sdk', async () => {
    const actual = await vi.importActual('@lifi/sdk')
    return {
        ...actual,
        getTokenBalancesByChain: vi.fn(),
        getTokenBalance: vi.fn(),
    }
})

const queryClient = new QueryClient()
const wrapper = (props: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, {client: queryClient}, props.children)

describe('useLifiBalances', () => {
    test('returns empty balances when disabled', async () => {
        const {result} = renderHook(
            () =>
                useLifiBalances({
                    evmAddress: undefined,
                    solanaAddress: undefined,
                    tokensByChain: {},
                    enabled: false,
                }),
            {wrapper}
        )

        expect(result.current.balancesByChain).toEqual(undefined)
    })
})
