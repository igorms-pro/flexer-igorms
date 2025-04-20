'use client'

import {Button, Card, CardContent, CircularProgress, Stack, Typography} from '@mui/material'
import {useEffect, useState} from 'react'
import {useUsdBalanceSnapshot} from '@/app/hooks/useUsdBalanceSnapshot'
import {useOnchainInscriptionFlow} from '@/app/hooks/useOnchainInscriptionFlow'
import {useWalletAddresses} from '@/app/hooks/useWalletAddresses'
import {Status} from '@/app/constants'
import {OnchainBalanceModal} from './OnchainBalanceModal'
import {SvmTransactionHistoryTable} from '@/app/components/solana/SvmTransactionHistoryTable'
import {OnchainInscriptionStatus} from '@/app/components/onchain/OnchainInscriptionStatus'

export const OnchainInscriptionPanel = () => {
    const {message, tooltipTableRows, totalUsd, isLoading: isBalanceLoading} = useUsdBalanceSnapshot()
    const {evmAddress, solanaAddress} = useWalletAddresses()
    const {state, context, start, reset} = useOnchainInscriptionFlow()

    const [mounted, setMounted] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleStart = () => {
        const address = evmAddress || solanaAddress
        const chain = evmAddress ? 'EVM' : solanaAddress ? 'SVM' : null

        if (!address || !chain) {
            return
        }
        start({address, chain, message})
    }

    return (
        <>
            <Card sx={{mt: 4}}>
                <CardContent>
                    <Stack spacing={2}>
                        {isBalanceLoading || !mounted ? (
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <CircularProgress size={20}/>
                                <Typography variant="body2">Calculating balance...</Typography>
                            </Stack>
                        ) : (
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" sx={{fontFamily: 'monospace'}}>
                                    {message}
                                </Typography>
                                <Button variant="outlined" size="small" onClick={() => setOpen(true)}>
                                    Show Breakdown
                                </Button>
                            </Stack>
                        )}
                        {state === Status.IDLE && (
                            <Button
                                variant="contained"
                                disabled={isBalanceLoading || (!evmAddress && !solanaAddress)}
                                onClick={handleStart}
                                fullWidth
                            >
                                Inscribe Balance On-Chain
                            </Button>
                        )}
                        <OnchainInscriptionStatus
                            state={state}
                            context={context}
                            onReset={reset}
                        />
                        <SvmTransactionHistoryTable shouldRefresh={state === Status.SUCCESS}/>
                    </Stack>
                </CardContent>
            </Card>

            <OnchainBalanceModal
                open={open}
                onClose={() => setOpen(false)}
                rows={tooltipTableRows}
                totalUsd={totalUsd}
            />
        </>
    )
}
