'use client'

import {useRef} from 'react'
import {Box, Button, CircularProgress, Collapse, IconButton, Typography,} from '@mui/material'
import {KeyboardArrowDown, KeyboardArrowUp} from '@mui/icons-material'
import {Token, TokenAmount} from '@lifi/types'
import {TokenList} from './TokenList'

interface Props {
    chainId: number
    chainName: string
    tokens: Token[]
    balances?: TokenAmount[]
    isExpanded: boolean
    isCollapsed: boolean
    visibleCount: number
    isLoading: boolean
    onShowMore: () => void
    onShowAll: () => void
    onShowLess: () => void
    onToggleCollapse: () => void
}

export const ChainTokenSection = ({
                                      chainId,
                                      chainName,
                                      tokens,
                                      balances,
                                      isExpanded,
                                      isCollapsed,
                                      visibleCount,
                                      isLoading,
                                      onShowMore,
                                      onShowAll,
                                      onShowLess,
                                      onToggleCollapse,
                                  }: Props) => {
    const sectionRef = useRef<HTMLDivElement | null>(null)

    const visibleTokens = tokens.slice(0, visibleCount)
    const remainingToShow = tokens.length - visibleCount
    const nextChunk = Math.min(15, remainingToShow)
    const canShowLess = visibleCount > 5

    return (
        <Box key={chainId} mb={4} ref={sectionRef}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
                flexWrap="wrap"
                gap={1}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">{chainName}</Typography>
                    <IconButton size="small" onClick={onToggleCollapse}>
                        {isCollapsed ? <KeyboardArrowDown/> : <KeyboardArrowUp/>}
                    </IconButton>
                </Box>

                {canShowLess && (
                    <Button size="small" color="inherit" onClick={onShowLess}>
                        Show Less
                    </Button>
                )}
            </Box>

            <Collapse in={!isCollapsed} timeout={300}>
                <TokenList tokens={visibleTokens} balances={balances}/>

                {tokens.length > 5 && (
                    <Box mt={2} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                        {!isExpanded && remainingToShow > 0 && (
                            <Button size="small" color="primary" onClick={onShowMore}>
                                {`Show More +${nextChunk}`}
                            </Button>
                        )}

                        {!isExpanded && remainingToShow > 0 && (
                            <Button
                                size="small"
                                color="secondary"
                                onClick={onShowAll}
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={20} color="info"/> : null}
                            >
                                Show All
                            </Button>
                        )}

                        {canShowLess && (
                            <Button size="small" color="inherit" onClick={onShowLess}>
                                Show Less
                            </Button>
                        )}
                    </Box>
                )}
            </Collapse>
        </Box>
    )
}
