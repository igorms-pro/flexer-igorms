'use client'

import Header from '@/components/Header'
import { Box, Container, Typography } from '@mui/material'

export default function Home() {
  return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
          <Box
              display="flex"
              flexDirection="column"
              gap={4}
              alignItems="center"
              justifyContent="center"
              minHeight="60vh"
          >
            <Typography variant="h4" fontWeight={600}>
              Welcome to Flexers Wallet
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Connect your EVM or Solana wallet to explore your net worth
              across chains.
            </Typography>
          </Box>
        </Container>
      </>
  )
}
