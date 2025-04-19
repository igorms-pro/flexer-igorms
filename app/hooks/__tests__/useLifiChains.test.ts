import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {beforeEach, describe, expect, test, vi} from 'vitest'
import {useLifiChains} from '../useLifiChains'
import {getChains} from '@lifi/sdk'
import {renderHook, waitFor} from '@testing-library/react'
import React from 'react'

vi.mock('@lifi/sdk', async () => {
    const actual = await vi.importActual('@lifi/sdk')
    return {
        ...actual,
        getChains: vi.fn(),
    }
})

const queryClient = new QueryClient()
const wrapper = (props: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, {client: queryClient}, props.children)

describe('useLifiChains', () => {
    beforeEach(() => {
        queryClient.clear()
        ;(getChains as ReturnType<typeof vi.fn>).mockReset()
    })

    test('should return list of chains', async () => {
        ;(getChains as ReturnType<typeof vi.fn>).mockResolvedValue([
            {id: 1, name: 'Ethereum'},
            {id: 137, name: 'Polygon'},
        ])

        const {result} = renderHook(() => useLifiChains(), {wrapper})

        await waitFor(() => result.current.chains?.length)

        expect(result.current.chains).toEqual([
            {id: 1, name: 'Ethereum'},
            {id: 137, name: 'Polygon'},
        ])
    })
})
