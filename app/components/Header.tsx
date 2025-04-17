'use client'

import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    useTheme,
} from '@mui/material'

import EvmWalletConnector from '@/app/components/wallets/EvmWalletConnector'
import SolanaWalletConnector from '@/app/components/wallets/SolanaWalletConnector'

export default function Header() {
    const theme = useTheme()

    return (
        <AppBar position="sticky" color="transparent" elevation={0}>
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    px: { xs: 2, sm: 4 },
                    py: 2,
                }}
            >
                <Typography variant="h6" fontWeight={600} sx={{ fontSize: '18px', letterSpacing: '0.5px' }}>
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
                    <EvmWalletConnector />
                    <SolanaWalletConnector />
                </Box>
            </Toolbar>
        </AppBar>
    )
}
