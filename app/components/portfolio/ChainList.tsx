'use client'

import {useLifiChains} from '@/app/hooks/useLifiChains'
import {Box, Chip, CircularProgress, Typography} from '@mui/material'

export const ChainList = () => {
    const {chains, isLoading} = useLifiChains()

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress/>
            </Box>
        )
    }

    if (!chains || chains.length === 0) {
        return (
            <Typography textAlign="center" mt={4}>
                No chains data available.
            </Typography>
        )
    }

    return (
        <Box mb={6}>
            <Box
                display="flex"
                flexWrap="wrap"
                gap={1.5}
                justifyContent="center"
                px={2}
                py={2}
            >
                {chains.map((chain) => (
                    <Chip
                        key={chain.id}
                        label={chain.name}
                        variant="outlined"
                        sx={{
                            fontSize: '14px',
                            cursor: 'pointer',
                            color: 'text.primary',
                            borderColor: '#f5b5ff',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    />
                ))}
            </Box>
        </Box>
    )
}
