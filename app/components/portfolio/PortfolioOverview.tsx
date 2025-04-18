'use client'

import {useRef, useState} from 'react'
import {Box, Button, CircularProgress, Collapse, Typography,} from '@mui/material'
import {useLifiChains} from '@/app/hooks/useLifiChains'
import {useLifiTokens} from '@/app/hooks/useLifiTokens'
import {TokenList} from './TokenList'

export const PortfolioOverview = () => {
    const {chains, isLoading: loadingChains} = useLifiChains()
    const {tokens: tokensByChain, isLoading: loadingTokens} = useLifiTokens()
    const [expandedChains, setExpandedChains] = useState<{ [chainId: number]: boolean }>({})
    const [loadingChainIds, setLoadingChainIds] = useState<number[]>([])

    const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({})

    if (loadingChains || loadingTokens) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress/>
            </Box>
        )
    }

    if (!chains || !tokensByChain) {
        return (
            <Typography textAlign="center" mt={4}>
                No data available.
            </Typography>
        )
    }

    return (
        <Box>
            {chains.map((chain) => {
                const tokens = tokensByChain[chain.id]
                if (!tokens || tokens.length === 0) return null

                const isExpanded = expandedChains[chain.id] ?? false
                const visibleTokens = isExpanded ? tokens : tokens.slice(0, 5)
                const isLoading = loadingChainIds.includes(chain.id)

                return (
                    <Box
                        key={chain.id}
                        mb={4}
                        ref={(el: HTMLDivElement | null) => {
                            sectionRefs.current[chain.id] = el
                        }}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            mb={2}
                            flexWrap="wrap"
                            gap={1}
                        >
                            <Typography variant="h6">{chain.name}</Typography>

                            {isExpanded && (
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setExpandedChains((prev) => ({
                                            ...prev,
                                            [chain.id]: false,
                                        }))
                                        setTimeout(() => {
                                            sectionRefs.current[chain.id]?.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start',
                                            })
                                        }, 100)
                                    }}
                                >
                                    Show Less
                                </Button>
                            )}
                        </Box>

                        <Collapse in={true} timeout={300}>
                            <TokenList tokens={visibleTokens}/>
                        </Collapse>

                        {tokens.length > 5 && !isExpanded && (
                            <Box mt={2} display="flex" justifyContent="center">
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setLoadingChainIds((prev) => [...prev, chain.id])
                                        setTimeout(() => {
                                            setExpandedChains((prev) => ({
                                                ...prev,
                                                [chain.id]: true,
                                            }))
                                            setLoadingChainIds((prev) =>
                                                prev.filter((id) => id !== chain.id)
                                            )
                                        }, 300)
                                    }}
                                    disabled={isLoading}
                                    startIcon={
                                        isLoading ? <CircularProgress size={20} color="info"/> : null
                                    }
                                >
                                    Show All
                                </Button>
                            </Box>
                        )}
                    </Box>
                )
            })}
        </Box>
    )
}
