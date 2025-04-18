import {useAccount} from 'wagmi'
import {useWallet} from '@solana/wallet-adapter-react'

export const useWalletAddresses = () => {
    const {address: evmAddress} = useAccount()
    const {publicKey} = useWallet()

    const solanaAddress = publicKey?.toBase58()
    return {evmAddress, solanaAddress}
}
