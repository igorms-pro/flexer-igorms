'use client'

import {Box, Grid, Typography, useMediaQuery, useTheme} from '@mui/material'
import type {Token} from '@lifi/types'


type Props = {
    tokens: Token[]
}

export const TokenList = ({tokens}: Props) => {
    const theme = useTheme()
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))

    return (
        <Grid container spacing={2}>
            {tokens.map((token) => (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                <Grid
                    item
                    key={token.address || token.symbol}
                    sx={{
                        flexBasis: isDesktop ? '180px' : 'calc(33.33% - 16px)',
                        maxWidth: isDesktop ? '180px' : 'calc(33.33% - 16px)',
                        flexGrow: 0,
                        flexShrink: 0,
                    }}
                >
                    <Box
                        border="1px solid #eee"
                        borderRadius={2}
                        p={1.25}
                        sx={{
                            height: isDesktop ? 88 : 100,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            overflow: 'hidden',
                        }}
                    >
                        <Typography fontWeight={600} noWrap sx={{fontSize: '15px'}}>
                            {token.symbol}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                            sx={{fontSize: '12px'}}
                        >
                            {token.name}
                        </Typography>
                        <Typography fontWeight={500} mt={0.5} sx={{fontSize: '14px'}}>
                            ${Number(token.priceUSD || 0).toFixed(2)}
                        </Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    )
}
