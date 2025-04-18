'use client'

import {Box, Grid, Typography, useMediaQuery, useTheme} from '@mui/material'
import type {Token, TokenAmount} from '@lifi/types'
import {formatBalance} from '@/app/utils/balance'
import {formatUnits} from 'viem'

type Props = {
    tokens: Token[]
    balances?: TokenAmount[]
}

export const TokenList = ({tokens, balances = []}: Props) => {
    const theme = useTheme()
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))

    const findBalance = (token: Token): string => {
        const match = balances.find(
            (b) => b.address.toLowerCase() === token.address.toLowerCase()
        )
        return match?.amount ? formatBalance(match.amount.toString()) : '-'
    }

    const findBalanceInUSD = (token: Token): string => {
        const match = balances.find(
            (b) => b.address.toLowerCase() === token.address.toLowerCase()
        )
        if (match?.amount) {
            const decimals = token.decimals ?? 18
            const readableBalance = parseFloat(formatUnits(match.amount, decimals))
            const balanceInUSD = readableBalance * parseFloat(token.priceUSD || '0')
            return `$${balanceInUSD.toFixed(2)}`
        }
        return '-'
    }

    return (
        <Grid container spacing={2} justifyContent="center">
            {tokens.map((token) => {
                const hasBalance = findBalance(token) !== '-'

                return (
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
                            border={`1px solid ${hasBalance ? '#f5b5ff' : '#eee'}`}
                            borderRadius={2}
                            p={1.25}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5,
                                height: '100%',
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'scale(1.04)',
                                },
                            }}
                        >
                            {/* Token Symbol */}
                            <Typography fontWeight={600} noWrap sx={{fontSize: '15px'}}>
                                {token.symbol}
                            </Typography>

                            {/* Token Name and Price */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: isDesktop ? 'row' : 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{fontSize: '12px'}}
                                >
                                    {token.name}
                                </Typography>
                                <Typography fontWeight={500} sx={{fontSize: '14px'}}>
                                    ${Number(token.priceUSD || 0).toFixed(2)}
                                </Typography>
                            </Box>

                            {/* Balance in Tokens */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: isDesktop ? 'row' : 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    fontWeight={400}
                                    color="text.secondary"
                                    sx={{fontSize: '14px'}}
                                >
                                    Balance:
                                </Typography>
                                <Typography
                                    variant="caption"
                                    fontWeight={400}
                                    sx={{fontSize: '14px'}}
                                >
                                    {findBalance(token)}
                                </Typography>
                            </Box>

                            {findBalanceInUSD(token) !== '-' && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: isDesktop ? 'row' : 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        fontWeight={400}
                                        color="text.secondary"
                                        sx={{fontSize: '13px'}}
                                    >
                                        USD:
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        fontWeight={500}
                                        sx={{fontSize: '14px'}}
                                    >
                                        {findBalanceInUSD(token)}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                )
            })}
        </Grid>
    )
}
