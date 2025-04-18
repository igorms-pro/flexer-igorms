'use client'

import {AppBar, Box, Toolbar, Typography,} from '@mui/material'

import EvmWalletConnector from '@/app/components/wallets/EvmWalletConnector'
import SolanaWalletConnector from '@/app/components/wallets/SolanaWalletConnector'

export default function Header() {

    return (
        <AppBar
            position="sticky"
            elevation={4}
            sx={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                zIndex: 1100,
                width: '100vw',
                left: 0,
                right: 0,
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    px: {xs: 2, sm: 4},
                    py: 2,
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{fontSize: '18px', letterSpacing: '0.5px'}}
                >
                    Flexers
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                    <EvmWalletConnector/>
                    <SolanaWalletConnector/>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
