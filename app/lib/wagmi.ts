import {getDefaultConfig} from '@rainbow-me/rainbowkit'
import {type Config} from '@wagmi/core'

import {arbitrumSepolia, avalancheFuji, baseGoerli, optimismSepolia, polygonMumbai, sepolia,} from 'wagmi/chains'

export const supportedChains = [
    sepolia,
    polygonMumbai,
    optimismSepolia,
    arbitrumSepolia,
    baseGoerli,
    avalancheFuji,
] as const

export const config: Config = getDefaultConfig({
    appName: 'Flexer Dashboard',
    projectId: '2b8a2eba47be02b3f633537d77198fc6',
    chains: supportedChains,
    ssr: false,
})
