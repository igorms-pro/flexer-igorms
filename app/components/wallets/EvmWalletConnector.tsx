'use client'

import { Button, Tooltip, Box, useTheme, useMediaQuery } from '@mui/material'
import { Copy, Check } from 'lucide-react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { shortenAddress } from '@/app/utils/address'
import { useCopyToClipboard } from '@/app/hooks/useCopyToClipboard'

export default function ConnectEvmWallet() {
    const { address, isConnected } = useAccount()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [copied, copyAddress] = useCopyToClipboard(address ?? '')

    if (!isConnected || !address) {
        return <ConnectButton label="EVM Wallet" showBalance={false} chainStatus="none" />
    }

    return (
        <>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                <Tooltip title={address} arrow>
                    <Button
                        onClick={copyAddress}
                        variant="outlined"
                        size="small"
                        sx={{
                            minWidth: 40,
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {copied ? <Check size={24} /> : <Copy size={24} />}
                    </Button>
                </Tooltip>
            </Box>

            <ConnectButton.Custom>
                {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
                    const ready = mounted
                    const connected = ready && account && chain
                    const short = shortenAddress(account?.address ?? '', {
                        start: isMobile ? 3 : 6,
                        end: isMobile ? 2 : 4,
                    })
                    return (
                        <Button
                            onClick={connected ? openAccountModal : openConnectModal}
                            variant="outlined"
                            size="small"
                            sx={{
                                textTransform: 'none',
                                fontSize: { xs: '14px', md: '18px' },
                                height: 40,
                                borderRadius: '8px',
                                px: 2,
                                fontWeight: 500,
                                minWidth: 'auto',
                            }}
                        >
                            {connected ? short : 'EVM Wallet'}
                        </Button>
                    )
                }}
            </ConnectButton.Custom>
        </>
    )
}
