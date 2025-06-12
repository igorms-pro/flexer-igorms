'use client'

import {useRef} from 'react'
import {Box, Button, CircularProgress, Collapse, IconButton, Typography} from '@mui/material'
import {KeyboardArrowDown} from '@mui/icons-material'
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
    const nextChunk = Math.min(10, remainingToShow)
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
                    <IconButton 
                        size="small" 
                        onClick={onToggleCollapse}
                        sx={{
                            transition: 'transform 0.2s ease',
                            transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                        }}
                    >
                        <KeyboardArrowDown/>
                    </IconButton>
                </Box>

                {!isCollapsed && canShowLess && (
                    <Button 
                        size="small" 
                        color="inherit" 
                        onClick={onShowLess}
                        sx={{
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                        }}
                    >
                        Show Less
                    </Button>
                )}
            </Box>

            <Collapse in={!isCollapsed} timeout={300}>
                <TokenList tokens={visibleTokens} balances={balances}/>

                {!isCollapsed && tokens.length > 5 && (
                    <Box 
                        mt={2} 
                        display="flex" 
                        justifyContent="center" 
                        gap={2} 
                        flexWrap="wrap"
                        sx={{
                            position: 'sticky',
                            bottom: 0,
                            backgroundColor: 'background.paper',
                            py: 1,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        {!isExpanded && remainingToShow > 0 && (
                            <Button 
                                size="small" 
                                color="primary" 
                                onClick={onShowMore}
                                sx={{
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                    },
                                }}
                            >
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
                                sx={{
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: 'rgba(156, 39, 176, 0.04)',
                                    },
                                }}
                            >
                                Show All
                            </Button>
                        )}

                        {canShowLess && (
                            <Button 
                                size="small" 
                                color="inherit" 
                                onClick={onShowLess}
                                sx={{
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    },
                                }}
                            >
                                Show Less
                            </Button>
                        )}
                    </Box>
                )}
            </Collapse>
        </Box>
    )
}
