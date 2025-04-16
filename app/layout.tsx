'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import 'react-toastify/dist/ReactToastify.css'

import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'

import { ThemeProvider, CssBaseline } from '@mui/material'
import { getTheme } from '@/lib/theme'
import { useEffect, useState } from 'react'
import { config } from '@/lib/wagmi'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

const queryClient = new QueryClient()

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const [mode, setMode] = useState<'light' | 'dark'>('dark')

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setMode(prefersDark ? 'dark' : 'light')
    }, [])

    const theme = getTheme(mode)

    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider modalSize="compact">
                        {children}
                        <ToastContainer
                            position="top-right"
                            autoClose={4000}
                            hideProgressBar={false}
                            newestOnTop
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme={mode}
                        />
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}
