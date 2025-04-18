import type {UseAccountReturnType} from 'wagmi'
import type {PublicKey} from '@solana/web3.js'
import type {WalletContextState} from '@solana/wallet-adapter-react'
import {vi} from 'vitest'

export const getMockAccount = ({
                                   address = '0xEVM_TEST_ADDRESS',
                                   isConnected = true,
                               }: {
    address?: `0x${string}`
    isConnected?: boolean
} = {}): UseAccountReturnType => {
    return {
        address,
        addresses: [address],
        chain: undefined,
        chainId: 1,
        connector: undefined,
        isConnected,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: false,
        status: isConnected ? 'connected' : 'disconnected',
    } as unknown as UseAccountReturnType
}

export const getMockSolanaWallet = ({
                                        address = 'SOLANA_TEST_ADDRESS',
                                        connected = true,
                                    }: {
    address?: string
    connected?: boolean
} = {}): WalletContextState =>
    ({
        publicKey: connected
            ? ({
                toBase58: () => address,
            } as PublicKey)
            : null,
        connected,
        connecting: false,
        disconnecting: false,
        select: vi.fn(),
        connect: vi.fn(),
        disconnect: vi.fn(),
        sendTransaction: vi.fn(),
        signTransaction: vi.fn(),
        signAllTransactions: vi.fn(),
        signMessage: vi.fn(),
        wallets: [],
        wallet: null,
        autoConnect: false,
    } as unknown as WalletContextState)


export const getMockDisconnectedAccount = (): UseAccountReturnType => {
    return {
        address: undefined,
        addresses: [],
        chain: undefined,
        chainId: undefined,
        connector: undefined,
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        status: 'disconnected',
    } as unknown as UseAccountReturnType
}
