'use client'

import {Alert, Button, CircularProgress, Link, Stack, Typography} from '@mui/material'
import {Status} from '@/app/constants'
import type {InscriptionContext} from '@/app/fsm/onchainMessageMachineTypes'

type StatusType = (typeof Status)[keyof typeof Status]

type Props = {
    state: StatusType
    context: InscriptionContext
    onReset: () => void
}

export const OnchainInscriptionStatus = ({state, context, onReset}: Props) => {
    const isPending = state === Status.PREPARING || state === Status.SIGNING
    const isSuccess = state === Status.SUCCESS
    const isError = state === Status.ERROR

    return (
        <Stack spacing={2}>
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
                        href={
                            context.chain === 'EVM'
                                ? `https://sepolia.etherscan.io/tx/${context.txHash}`
                                : `https://explorer.solana.com/tx/${context.txHash}?cluster=devnet`
                        }
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
                <Button variant="outlined" onClick={onReset} fullWidth>
                    Reset
                </Button>
            )}
        </Stack>
    )
}
