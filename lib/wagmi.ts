import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    avalanche,
} from 'wagmi/chains'
import { type Config } from '@wagmi/core'

export const supportedChains = [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    avalanche,
] as const

export const config: Config = getDefaultConfig({
    appName: 'Flexer Dashboard',
    projectId: '2b8a2eba47be02b3f633537d77198fc6',
    chains: supportedChains,
    ssr: true,
})
