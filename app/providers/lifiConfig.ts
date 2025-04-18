import {createConfig, EVM} from '@lifi/sdk'
import {createWalletClient, http} from 'viem'
import {privateKeyToAccount} from 'viem/accounts'
import {arbitrum, Chain, mainnet, optimism, polygon} from 'viem/chains'

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY as string

if (!privateKey) {
    throw new Error('Private key not found in environment variables.')
}

const account = privateKeyToAccount(`0x${privateKey}`)

const switchChains = [mainnet, arbitrum, optimism, polygon] as Chain[]

const client = createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
})

export const configureLifi = () => {
    createConfig({
        integrator: 'Your dApp/company name',
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
