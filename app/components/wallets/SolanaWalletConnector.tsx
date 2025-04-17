'use client'

import {useMemo, useState} from 'react'
import {
    useTheme,
    useMediaQuery,
    Button,
    Tooltip,
    Box,

} from '@mui/material'
import {Copy, Check} from 'lucide-react'
import {useWallet} from '@solana/wallet-adapter-react'
import {
    useWalletModal,
} from '@solana/wallet-adapter-react-ui'
import {WalletReadyState} from '@solana/wallet-adapter-base'
import SolanaDisconnectModal from './SolanaDisconnectModal'

import {shortenAddress} from '@/app/utils/address'
import {useCopyToClipboard} from '@/app/hooks/useCopyToClipboard'

export default function SolanaWalletConnector() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const {wallets, publicKey, disconnect} = useWallet()
    const {setVisible} = useWalletModal()

    const address = publicKey?.toBase58() ?? ''
    const [copied, copyAddress] = useCopyToClipboard(address)

    const usable = useMemo(
        () =>
            wallets.filter(
                (w) =>
                    w.readyState === WalletReadyState.Installed ||
                    w.readyState === WalletReadyState.Loadable
            ),
        [wallets]
    )

    const [open, setOpen] = useState(false)

    if (usable.length === 0) {
        return (
            <Button
                variant="contained"
                size="small"
                onClick={() =>
                    window.open('https://phantom.app/download', '_blank')
                }
                sx={{
                    textTransform: 'none',
                    backgroundColor: '#9945FF',
                    '&:hover': {backgroundColor: '#7c35d5'},
                    color: '#fff',
                    height: 40,
                    borderRadius: '8px',
                    px: 2,
                    fontSize: {xs: '14px', md: '18px'},
                }}
            >
                Install Phantom
            </Button>
        )
    }

    if (!publicKey) {
        return (
            <Button
                onClick={() => setVisible(true)}
                variant="contained"
                size="small"
                sx={{
                    textTransform: 'none',
                    backgroundColor: '#9945FF',
                    '&:hover': {backgroundColor: '#7c35d5'},
                    color: '#fff',
                    height: 40,
                    borderRadius: '8px',
                    px: 2,
                    fontSize: {xs: '14px', md: '18px'},
                }}
            >
                Connect Solana
            </Button>
        )
    }

    const short = shortenAddress(address, {
        start: isMobile ? 3 : 6,
        end: isMobile ? 2 : 4,
    })

    return (
        <>
            <Box
                sx={{
                    display: {xs: 'none', md: 'flex'},
                    alignItems: 'center',
                    mr: 1,
                }}
            >
                <Tooltip title={address} arrow>
                    <Button
                        onClick={copyAddress}
                        variant="outlined"
                        size="small"
                        sx={{
                            minWidth: 40,
                            width: 40,
                            height: 40,
                            borderColor: '#9945FF',
                            color: '#9945FF',
                            '&:hover': {backgroundColor: 'rgba(153,69,255,0.1)'},
                        }}
                    >
                        {copied ? <Check size={24}/> : <Copy size={24}/>}
                    </Button>
                </Tooltip>
            </Box>

            <Button
                onClick={() => setOpen(true)}
                variant="outlined"
                size="small"
                sx={{
                    textTransform: 'none',
                    borderColor: '#9945FF',
                    color: '#9945FF',
                    '&:hover': {backgroundColor: 'rgba(153,69,255,0.1)'},
                    height: 40,
                    borderRadius: '8px',
                    px: 2,
                    fontSize: {xs: '14px', md: '18px'},
                }}
            >
                {short}
            </Button>
            <SolanaDisconnectModal
                open={open}
                onClose={() => setOpen(false)}
                address={address}
                onDisconnect={disconnect}
                onCopyAddress={copyAddress}
                copied={copied}
            />
        </>
    )
}
