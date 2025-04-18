import {beforeEach, describe, expect, it, vi} from 'vitest'
import {renderHook} from '@testing-library/react'
import {useAccount} from 'wagmi'
import {useWallet} from '@solana/wallet-adapter-react'
import {useWalletAddresses} from '../useWalletAddresses'
import {getMockAccount, getMockDisconnectedAccount, getMockSolanaWallet} from '@/app/utils/test-utils'

vi.mock('wagmi', async () => {
    const actual = await vi.importActual('wagmi')
    return {
        ...actual,
        useAccount: vi.fn(),
    }
})

vi.mock('@solana/wallet-adapter-react', () => ({
    useWallet: vi.fn(),
}))

describe('useWalletAddresses', () => {
    const mockUseAccount = vi.mocked(useAccount)
    const mockUseWallet = vi.mocked(useWallet)

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return both addresses when connected', () => {
        mockUseAccount.mockReturnValue(getMockAccount({address: '0xEVM_TEST_ADDRESS', isConnected: true}))
        mockUseWallet.mockReturnValue(getMockSolanaWallet({address: 'SOLANA_TEST_ADDRESS', connected: true}))

        const {result} = renderHook(() => useWalletAddresses())

        expect(result.current).toEqual({
            evmAddress: '0xEVM_TEST_ADDRESS',
            solanaAddress: 'SOLANA_TEST_ADDRESS',
        })
    })

    it('should handle EVM only connection', () => {
        mockUseAccount.mockReturnValue(getMockAccount({address: '0xEVM_ONLY_ADDRESS', isConnected: true}))
        mockUseWallet.mockReturnValue(getMockSolanaWallet({connected: false}))

        const {result} = renderHook(() => useWalletAddresses())

        expect(result.current).toEqual({
            evmAddress: '0xEVM_ONLY_ADDRESS',
            solanaAddress: undefined,
        })
    })

    it('should handle Solana only connection', () => {
        mockUseAccount.mockReturnValue(getMockDisconnectedAccount())
        mockUseWallet.mockReturnValue(getMockSolanaWallet({
            address: 'SOLANA_ONLY_ADDRESS',
            connected: true,
        }))

        const {result} = renderHook(() => useWalletAddresses())

        expect(result.current).toEqual({
            evmAddress: undefined,
            solanaAddress: 'SOLANA_ONLY_ADDRESS',
        })
    })

    it('should handle no connections', () => {
        mockUseAccount.mockReturnValue(getMockDisconnectedAccount())
        mockUseWallet.mockReturnValue(getMockSolanaWallet({connected: false}))

        const {result} = renderHook(() => useWalletAddresses())

        expect(result.current).toEqual({
            evmAddress: undefined,
            solanaAddress: undefined,
        })
    })
})
