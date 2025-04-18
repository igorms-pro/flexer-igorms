'use client'
import {WagmiProvider} from 'wagmi'
import {RainbowKitProvider} from '@rainbow-me/rainbowkit'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ToastContainer} from 'react-toastify'
import {config} from '@/app/lib/wagmi'
import SolanaProvider from '../providers/SolanaProvider'
import {configureLifi} from '@/app/providers/lifiConfig'

const queryClient = new QueryClient()

export default function ClientProviders({
                                            children,
                                            themeMode,
                                        }: {
    children: React.ReactNode
    themeMode: 'light' | 'dark'
}) {
    configureLifi()

    return (
        <SolanaProvider>
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={config}>
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
                            theme={themeMode}
                        />
                    </RainbowKitProvider>
                </WagmiProvider>
            </QueryClientProvider>
        </SolanaProvider>
    )
}
