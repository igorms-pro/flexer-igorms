'use client'

import {Box, Grid, Typography, useMediaQuery, useTheme} from '@mui/material'
import type {Token, TokenAmount} from '@lifi/types'
import {formatBalance} from '@/app/utils/balance'
import {SOLANA_LIFI_CHAIN_ID} from '@/app/constants'

type Props = {
    tokens: Token[]
    balances?: TokenAmount[]
}

export const TokenList = ({tokens, balances = []}: Props) => {
    const theme = useTheme()
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))

    const findBalanceMatch = (token: Token): TokenAmount | undefined => {
        const tokenAddr = token.address?.toLowerCase?.()

        const match = balances.find((b) => {
            const balanceAddr = b.address?.toLowerCase?.()
            const isSolMatch =
                token.symbol === 'SOL' &&
                b.symbol === 'SOL' &&
                token.chainId === SOLANA_LIFI_CHAIN_ID &&
                b.chainId === SOLANA_LIFI_CHAIN_ID

            const isGenericMatch = tokenAddr && balanceAddr && tokenAddr === balanceAddr

            return isSolMatch || isGenericMatch
        })
        return match
    }

    const findBalance = (token: Token): string => {
        const match = findBalanceMatch(token)
        if (!match?.amount) return '-'
        return formatBalance(match.amount, token.decimals ?? 18)
    }
    const findBalanceInUSD = (token: Token): string => {
        const match = findBalanceMatch(token)
        if (!match?.amount) return '-'

        const balanceFormatted = parseFloat(formatBalance(match.amount, token.decimals ?? 18, 12)) // 12 pour précision
        const balanceInUSD = balanceFormatted * parseFloat(token.priceUSD || '0')

        return `$${balanceInUSD.toFixed(2)}`
    }
    const hasPositiveBalance = (token: Token): boolean => {
        const match = findBalanceMatch(token)
        return match?.amount !== undefined && match.amount > BigInt(0)
    }

    return (
        <Grid container spacing={2} justifyContent="center">
            {tokens.map((token) => {
                const borderColor = hasPositiveBalance(token) ? '#f5b5ff' : '#eee'

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
                            border={`1px solid ${borderColor}`}
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
                            <Typography fontWeight={600} noWrap sx={{fontSize: '15px'}}>
                                {token.symbol}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: isDesktop ? 'row' : 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" sx={{fontSize: '12px'}}>
                                    {token.name}
                                </Typography>
                                <Typography fontWeight={500} sx={{fontSize: '14px'}}>
                                    ${Number(token.priceUSD || 0).toFixed(2)}
                                </Typography>
                            </Box>
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
                                <Typography variant="caption" fontWeight={400} sx={{fontSize: '14px'}}>
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
                                    <Typography variant="caption" fontWeight={500} sx={{fontSize: '14px'}}>
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
