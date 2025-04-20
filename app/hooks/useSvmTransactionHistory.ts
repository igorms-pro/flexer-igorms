import {useCallback, useEffect, useState} from 'react';
import {useConnection, useWallet} from '@solana/wallet-adapter-react';
import {ParsedInstruction, ParsedTransactionWithMeta,} from '@solana/web3.js';

export const useSvmTransactionHistory = () => {
    const {connection} = useConnection();
    const {publicKey} = useWallet();

    const [transactions, setTransactions] = useState<ParsedTransactionWithMeta[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTransactions = useCallback(async () => {
        if (!publicKey) return;

        setLoading(true);
        try {
            const signatures = await connection.getSignaturesForAddress(publicKey, {limit: 20});
            const parsedTxs = await Promise.all(
                signatures.map(sig => connection.getParsedTransaction(sig.signature, 'confirmed'))
            );

            // filtering for lifi onchain inscription
            const filtered = (parsedTxs.filter(Boolean) as ParsedTransactionWithMeta[]).filter(tx =>
                tx.transaction.message.instructions.some((ix): ix is ParsedInstruction =>
                    'parsed' in ix &&
                    typeof ix.parsed === 'string' &&
                    'program' in ix &&
                    ix.program === 'spl-memo' &&
                    ix.parsed.startsWith('Balance: US$')
                )
            );

            setTransactions(filtered);
        } catch (err) {
            console.warn('[SVM][Tx History] Error:', err);
        } finally {
            setLoading(false);
        }
    }, [connection, publicKey]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return {transactions, loading, refetch: fetchTransactions};
};
