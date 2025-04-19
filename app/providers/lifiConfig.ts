import {createConfig, EVM} from '@lifi/sdk'
import {createWalletClient, http} from 'viem'
import {privateKeyToAccount} from 'viem/accounts'
import {arbitrumSepolia, Chain, optimismSepolia, polygonMumbai, sepolia,} from 'viem/chains'

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY as string

if (!privateKey) {
    throw new Error('Private key not found in environment variables.')
}

const account = privateKeyToAccount(`0x${privateKey}`)

const switchChains = [sepolia, arbitrumSepolia, optimismSepolia, polygonMumbai] as Chain[]

const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
})

export const configureLifi = () => {
    createConfig({
        integrator: 'Flexer Testnet',
        providers: [
            EVM({
                getWalletClient: () => Promise.resolve(client),
                switchChain: (chainId) => {
                    const selectedChain = switchChains.find((chain) => chain.id === chainId)
                    if (!selectedChain) {
                        throw new Error(`Chain with ID ${chainId} not found`)
                    }
                    return Promise.resolve(
                        createWalletClient({
                            account,
                            chain: selectedChain,
                            transport: http(),
                        })
                    )
                },
            }),
        ],
    })
}
