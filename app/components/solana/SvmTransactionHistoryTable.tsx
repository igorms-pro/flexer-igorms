'use client'

import {useEffect} from 'react'
import {CircularProgress, Link, Stack, Typography} from '@mui/material'
import {useSvmTransactionHistory} from '@/app/hooks/useSvmTransactionHistory'

type Props = {
    shouldRefresh: boolean
}

export const SvmTransactionHistoryTable = ({shouldRefresh}: Props) => {
    const {transactions, loading, refetch} = useSvmTransactionHistory()

    useEffect(() => {
        if (shouldRefresh) {
            refetch()
        }
    }, [shouldRefresh, refetch])

    if (loading) {
        return (
            <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16}/>
                <Typography variant="caption">Loading recent transactions...</Typography>
            </Stack>
        )
    }

    if (!transactions.length) return null

    return (
        <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{mt: 2}}>
                Recent SVM Transactions
            </Typography>
            {transactions.map((tx) => (
                <Stack key={tx.transaction.signatures[0]} spacing={0.5}>
                    <Link
                        href={`https://explorer.solana.com/tx/${tx.transaction.signatures[0]}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                        sx={{fontFamily: 'monospace'}}
                    >
                        {tx.transaction.signatures[0]}
                    </Link>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(tx.blockTime! * 1000).toLocaleString()}
                    </Typography>
                </Stack>
            ))}
        </Stack>
    )
}
