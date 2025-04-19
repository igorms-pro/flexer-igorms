'use client'

import {Box, Container, Typography} from '@mui/material'
import dynamic from 'next/dynamic'
import {ChainList} from './components/portfolio/ChainList'
import {OnchainInscriptionPanel} from "@/app/components/onchain/OnchainInscriptionPanel";

const Header = dynamic(() => import('@/app/components/Header'), {ssr: false})
const PortfolioOverview = dynamic(() => import('@/app/components/portfolio/PortfolioOverview').then(mod => mod.PortfolioOverview), {
    ssr: false,
})

export default function Home() {
    return (
        <>
            <Header/>
            <Container
                maxWidth="lg"
                sx={{pt: 4, pb: 8, px: {xs: 2, sm: 4}}}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={4}
                    alignItems="center"
                    justifyContent="center"
                    minHeight="20vh"
                >
                    <Typography variant="h4" fontWeight={600}>
                        Welcome to Flexers Wallet
                    </Typography>
                </Box>

                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={600}
                        textAlign="left"
                        gutterBottom
                        color="#f5b5ff"
                    >
                        Supported Chains
                    </Typography>
                    <ChainList/>
                </Box>

                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={600}
                        textAlign="left"
                        gutterBottom
                        color="#f5b5ff"
                    >
                        Tokens
                    </Typography>
                    <PortfolioOverview/>
                </Box>
                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={600}
                        textAlign="left"
                        gutterBottom
                        color="#f5b5ff"
                    >
                        On-Chain USD Balance Snapshot
                    </Typography>
                    <OnchainInscriptionPanel/>
                </Box>
            </Container>
        </>
    )
}
