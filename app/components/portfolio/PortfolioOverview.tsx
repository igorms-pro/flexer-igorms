'use client'

import {useRef, useState} from 'react'
import {Box, Button, CircularProgress, Collapse, Typography} from '@mui/material'
import {useLifiChains} from '@/app/hooks/useLifiChains'
import {useLifiTokens} from '@/app/hooks/useLifiTokens'
import {ChainTokenSection} from './ChainTokenSection'

export const PortfolioOverview = () => {
    const {chains, isLoading: loadingChains} = useLifiChains()
    const {tokens: tokensByChain, isLoading: loadingTokens} = useLifiTokens()

    const [expandedChains, setExpandedChains] = useState<{ [chainId: number]: boolean }>({})
    const [collapsedChains, setCollapsedChains] = useState<{ [chainId: number]: boolean }>({})
    const [loadingChainIds, setLoadingChainIds] = useState<number[]>([])
    const [visibleCounts, setVisibleCounts] = useState<{ [chainId: number]: number }>({})
    const [showTokens, setShowTokens] = useState(true)

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
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="outlined" size="small" onClick={() => setShowTokens((prev) => !prev)}>
                    {showTokens ? 'Hide Tokens' : 'Show Tokens'}
                </Button>
            </Box>

            <Collapse in={showTokens} timeout={400}>
                {chains.map((chain) => {
                    const tokens = tokensByChain[chain.id]
                    if (!tokens || tokens.length === 0) return null

                    const isExpanded = expandedChains[chain.id] ?? false
                    const isCollapsed = collapsedChains[chain.id] ?? false
                    const visibleCount = isExpanded ? tokens.length : visibleCounts[chain.id] ?? 5
                    const isLoading = loadingChainIds.includes(chain.id)
                    const remainingToShow = tokens.length - visibleCount
                    const nextChunk = Math.min(20, remainingToShow)

                    return (
                        <ChainTokenSection
                            key={chain.id}
                            chainId={chain.id}
                            chainName={chain.name}
                            tokens={tokens}
                            isExpanded={isExpanded}
                            isCollapsed={isCollapsed}
                            visibleCount={visibleCount}
                            isLoading={isLoading}
                            onToggleCollapse={() =>
                                setCollapsedChains((prev) => ({
                                    ...prev,
                                    [chain.id]: !isCollapsed
                                }))
                            }
                            onShowMore={() =>
                                setVisibleCounts((prev) => ({
                                    ...prev,
                                    [chain.id]: visibleCount + nextChunk
                                }))
                            }
                            onShowAll={() => {
                                setLoadingChainIds((prev) => [...prev, chain.id])
                                setTimeout(() => {
                                    setExpandedChains((prev) => ({...prev, [chain.id]: true}))
                                    setVisibleCounts((prev) => ({...prev, [chain.id]: tokens.length}))
                                    setLoadingChainIds((prev) => prev.filter((id) => id !== chain.id))
                                }, 300)
                            }}
                            onShowLess={() => {
                                setExpandedChains((prev) => ({...prev, [chain.id]: false}))
                                setVisibleCounts((prev) => ({...prev, [chain.id]: 5}))
                                setTimeout(() => {
                                    sectionRefs.current[chain.id]?.scrollIntoView({behavior: 'smooth', block: 'start'})
                                }, 100)
                            }}
                        />
                    )
                })}
            </Collapse>
        </Box>
    )
}
