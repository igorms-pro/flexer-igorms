import {createConfig, EVM} from '@lifi/sdk'
import {arbitrumSepolia, Chain, optimismSepolia, polygonMumbai, sepolia} from 'viem/chains'
import {useWalletClient} from 'wagmi'
import {useEffect} from 'react'

const switchChains = [sepolia, arbitrumSepolia, optimismSepolia, polygonMumbai] as Chain[]

export const useLifiConfig = () => {
    const {data: walletClient} = useWalletClient()

    useEffect(() => {
        if (!walletClient) {
            return
        }

        createConfig({
            integrator: 'Flexer Testnet',
            providers: [
                EVM({
                    getWalletClient: () => Promise.resolve(walletClient),
                    switchChain: (chainId) => {
                        const selectedChain = switchChains.find((chain) => chain.id === chainId)
                        if (!selectedChain) {
                            throw new Error(`Chain with ID ${chainId} not found`)
                        }
                        return Promise.resolve(walletClient)
                    },
                }),
            ],
        })
    }, [walletClient])
}
