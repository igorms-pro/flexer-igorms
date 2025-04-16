'use client'

import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Tooltip,
    Fade,
    useTheme,
} from '@mui/material'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMediaQuery } from '@mui/material'

export default function Header() {
    const theme = useTheme()
    const { address: evmAddress, isConnected: isEvmConnected } = useAccount()
    const { publicKey: solanaPubKey, connect: connectSolana } = useWallet()
    const solanaAddress = solanaPubKey?.toBase58()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [copied, setCopied] = useState(false)

    const copyToClipboard = () => {
        if (evmAddress) {
            navigator.clipboard.writeText(evmAddress)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const shorten = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4)

    return (
        <AppBar position="sticky" color="transparent" elevation={0}>
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    px: { xs: 2, sm: 4 },
                    py: 2,
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ fontSize: '18px', letterSpacing: '0.5px' }}
                >
                    Flexers
                </Typography>

                <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                        fontSize: '21px',
                        display: { xs: 'none', md: 'block' },
                        color: theme.palette.text.secondary,
                    }}
                >
                    Connect your wallets
                </Typography>

                <Box display="flex" alignItems="center" gap={2}>
                    {isEvmConnected && evmAddress && (
                        <Box display="flex" alignItems="center" gap={1}>
                            <Box
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    alignItems: 'center',
                                }}
                            >
                                <Tooltip title={`Full address: ${evmAddress}`} arrow>
                                    <Button
                                        onClick={copyToClipboard}
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
                                {({
                                      account,
                                      chain,
                                      openAccountModal,
                                      openConnectModal,
                                      mounted,
                                  }) => {
                                    const ready = mounted
                                    const connected = ready && account && chain
                                    const shortMobileAddress = account?.address
                                        ? `0x${account.address.slice(2, 3)}...${account.address.slice(-2)}`
                                        : ''

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
                                            {connected
                                                ? isMobile
                                                    ? shortMobileAddress
                                                    : account.displayName
                                                : 'EVM Wallet'}
                                        </Button>

                                    )
                                }}
                            </ConnectButton.Custom>
                        </Box>
                    )}

                    {!isEvmConnected && (
                        <ConnectButton label="EVM Wallet" showBalance={false} chainStatus="none" />
                    )}

                    {solanaAddress ? (
                        <Tooltip
                            title={`Solana address: ${solanaAddress}`}
                            arrow
                            TransitionComponent={Fade}
                        >
                            <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={() => {
                                    navigator.clipboard.writeText(solanaAddress)
                                    setCopied(true)
                                    setTimeout(() => setCopied(false), 2000)
                                }}
                                startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                                sx={{
                                    fontSize: '12px',
                                    textTransform: 'none',
                                }}
                            >
                                {shorten(solanaAddress)}
                            </Button>
                        </Tooltip>
                    ) : (
                        <Button
                            variant="contained"
                            sx={{
                                fontSize: '13px',
                                textTransform: 'none',
                                px: 2,
                                py: 1,
                                borderRadius: '8px',
                                fontWeight: 500,
                            }}
                            onClick={async () => {
                                try {
                                    await connectSolana()
                                } catch (e) {
                                    console.error('Solana connection failed:', e)
                                }
                            }}
                        >
                            Solana Wallet
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}
