import {Address, Chain, PublicClient, toHex, WalletClient} from 'viem';

export const sendMessageEvm = async ({
                                         client,
                                         publicClient,
                                         message,
                                         address,
                                         chain,
                                     }: {
    client: WalletClient;
    publicClient: PublicClient;
    message: string;
    address: Address;
    chain: Chain;
}): Promise<`0x${string}`> => {
    const data = toHex(message);

    const hash = await client.sendTransaction({
        account: address,
        to: address,
        data,
        value: BigInt(0),
        chain,
    });

    await publicClient.waitForTransactionReceipt({hash});

    return hash;
};
