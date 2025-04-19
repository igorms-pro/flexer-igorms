'use client'

import {Alert, Button, Card, CardContent, CircularProgress, Link, Stack, Typography,} from '@mui/material'
import {useEffect, useState} from 'react'
import {useUsdBalanceSnapshot} from '@/app/hooks/useUsdBalanceSnapshot'
import {useOnchainInscriptionFlow} from '@/app/hooks/useOnchainInscriptionFlow'
import {Status} from '@/app/constants'

export const OnchainInscriptionPanel = () => {
    const {message, isLoading: isBalanceLoading} = useUsdBalanceSnapshot()
    const {state, context, start, reset} = useOnchainInscriptionFlow()

    const isPending = state === Status.PREPARING || state === Status.SIGNING
    const isSuccess = state === Status.SUCCESS
    const isError = state === Status.ERROR

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    const handleStart = () => {
        if (!context.address || !context.chain) return
        start({address: context.address, chain: context.chain, message})
    }

    return (
        <Card sx={{mt: 4}}>
            <CardContent>
                <Stack spacing={2}>
                    {isBalanceLoading || !mounted ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <CircularProgress size={20}/>
                            <Typography variant="body2">Calculating balance...</Typography>
                        </Stack>
                    ) : (
                        <Typography variant="body2" sx={{fontFamily: 'monospace'}}>
                            {message}
                        </Typography>
                    )}

                    {state === Status.IDLE && (
                        <Button
                            variant="contained"
                            disabled={isBalanceLoading}
                            onClick={handleStart}
                            fullWidth
                        >
                            Inscribe Balance On-Chain
                        </Button>
                    )}

                    {isPending && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <CircularProgress size={20}/>
                            <Typography variant="body2">
                                {state === Status.PREPARING && '🔄 Preparing inscription...'}
                                {state === Status.SIGNING && '✍️ Awaiting wallet signature...'}
                            </Typography>
                        </Stack>
                    )}

                    {isSuccess && context.txHash && (
                        <Alert severity="success">
                            ✅ Inscription complete.{' '}
                            <Link
                                href={`https://explorer.solana.com/tx/${context.txHash}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View transaction
                            </Link>
                        </Alert>
                    )}

                    {isError && context.error && (
                        <Alert severity="error">
                            ❌ Transaction failed: {context.error}
                        </Alert>
                    )}

                    {(isSuccess || isError) && (
                        <Button variant="outlined" onClick={reset} fullWidth>
                            Reset
                        </Button>
                    )}
                </Stack>
            </CardContent>
        </Card>
    )
}
