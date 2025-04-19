import {arbitrum, avalanche, base, bsc, mainnet, optimism, polygon,} from 'viem/chains'
import type {ChainId} from '@lifi/sdk'

export const FIVE_MINUTES = 5 * 60 * 1000
export const THIRTY_SECONDS = 30_000;

export const SOLANA_LIFI_CHAIN_ID: ChainId = 1151111081099710

export const POPULAR_EVM_CHAINS: ChainId [] = [
    mainnet.id,         // 1 - Ethereum
    arbitrum.id,        // 42161
    optimism.id,        // 10
    polygon.id,         // 137
    base.id,            // 8453
    bsc.id,             // 56
    avalanche.id,       // 43114
]

export const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'

export const Status = {
    IDLE: 'idle',
    PREPARING: 'preparing',
    SIGNING: 'signing',
    SENDING: 'sending',
    WAITING: 'waiting',
    SUCCESS: 'success',
    ERROR: 'error',
} as const;

export const EventType = {
    START: 'START',
    PREPARED: 'PREPARED',
    SIGNED: 'SIGNED',
    FAIL: 'FAIL',
    RESET: 'RESET',
} as const;
