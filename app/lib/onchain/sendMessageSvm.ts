import {Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction,} from '@solana/web3.js';
import {WalletContextState} from '@solana/wallet-adapter-react';

export const sendMessageSvm = async ({
                                         wallet,
                                         message,
                                         connection,
                                     }: {
    wallet: WalletContextState;
    message: string;
    connection: Connection;
}): Promise<string> => {
    if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected');
    }

    const transferIx = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey,
        lamports: 0,
    });

    const memoIx = new TransactionInstruction({
        keys: [],
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        data: Buffer.from(message, 'utf-8'),
    });

    const transaction = new Transaction().add(transferIx, memoIx);
    transaction.feePayer = wallet.publicKey;

    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;

    const signed = await wallet.signTransaction(transaction);
    const txId = await connection.sendRawTransaction(signed.serialize());

    await connection.confirmTransaction({
        signature: txId,
        ...latestBlockhash,
    });

    return txId;
};
