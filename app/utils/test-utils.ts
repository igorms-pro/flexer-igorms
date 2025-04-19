import type {UseAccountReturnType} from 'wagmi';
import type {PublicKey} from '@solana/web3.js';
import type {WalletContextState} from '@solana/wallet-adapter-react';
import {vi} from 'vitest';

/**
 * Mock d’un compte EVM connecté (useAccount).
 */
export const getMockAccount = ({
                                   address = '0xEVM_TEST_ADDRESS',
                                   isConnected = true,
                               }: {
    address?: `0x${string}`;
    isConnected?: boolean;
} = {}): UseAccountReturnType => ({
    address,
    addresses: [address],
    chain: undefined,
    chainId: 1,
    connector: undefined,
    isConnected,
    isConnecting: false,
    isReconnecting: false,
    isDisconnected: !isConnected,
    status: isConnected ? 'connected' : 'disconnected',
} as unknown as UseAccountReturnType);

/**
 * Mock d’un compte EVM déconnecté.
 */
export const getMockDisconnectedAccount = (): UseAccountReturnType => ({
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
} as unknown as UseAccountReturnType);

/**
 * Mock d’un wallet Solana compatible WalletContextState.
 */
export const getMockSolanaWallet = ({
                                        address = 'SOLANA_TEST_ADDRESS',
                                        connected = true,
                                    }: {
    address?: string;
    connected?: boolean;
} = {}): WalletContextState => ({
    publicKey: connected
        ? ({toBase58: () => address} as PublicKey)
        : null,
    connected,
    connecting: false,
    disconnecting: false,
    select: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    sendTransaction: vi.fn(),
    signTransaction: vi.fn().mockImplementation(async (tx) => tx),
    signAllTransactions: vi.fn(),
    signMessage: vi.fn(),
    signIn: vi.fn(),
    wallets: [],
    wallet: null,
    autoConnect: false,
});
