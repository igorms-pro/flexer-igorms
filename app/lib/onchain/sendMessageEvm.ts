import {Address, Chain, PublicClient, toHex, WalletClient} from 'viem'

export const sendMessageEvm = async ({
                                         client,
                                         publicClient,
                                         message,
                                         address,
                                         chain,
                                     }: {
    client: WalletClient
    publicClient: PublicClient
    message: string
    address: Address
    chain: Chain
}): Promise<`0x${string}`> => {
    const data = toHex(message)

    // using burn address as a mock recipient to allow sending a transaction with data,
    // since sending to self with data is rejected by some evm rpc like sepolia.
    const hash = await client.sendTransaction({
        account: address,
        to: '0x000000000000000000000000000000000000dEaD',
        data,
        value: BigInt(0),
        chain,
    })

    await publicClient.waitForTransactionReceipt({hash})

    return hash
}
