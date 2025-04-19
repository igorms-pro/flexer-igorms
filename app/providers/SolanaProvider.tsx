"use client";

import {FC, useMemo} from 'react'
import {clusterApiUrl} from '@solana/web3.js'
import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react'
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base'
import {WalletModalProvider} from '@solana/wallet-adapter-react-ui'
import {PhantomWalletAdapter} from '@solana/wallet-adapter-wallets'

const SolanaProvider: FC<{ children: React.ReactNode }> = ({children}) => {
    const network = WalletAdapterNetwork.Devnet
    const endpoint = useMemo(() => clusterApiUrl(network), [network])
    const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default SolanaProvider
