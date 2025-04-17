'use client'


import { Geist, Geist_Mono } from 'next/font/google'
import { useEffect, useState } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { getTheme } from '@/app/lib/theme'
import ClientProviders from '@/app/components/ClientProviders'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<'light' | 'dark'>('dark')

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setMode(prefersDark ? 'dark' : 'light')
    }, [])

    const theme = getTheme(mode)

    return (
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <ClientProviders themeMode={mode}>{children}</ClientProviders>
            </ThemeProvider>
        </div>
    )
}
