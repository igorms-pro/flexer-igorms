'use client'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Paper,
    Box,
    Button,
    Tooltip,
} from '@mui/material'
import { Copy, Check } from 'lucide-react'

interface SolanaDisconnectModalProps {
    open: boolean
    onClose: () => void
    address: string
    onDisconnect: () => void
    onCopyAddress: () => void
    copied: boolean
}

export default function SolanaDisconnectModal({
                                                  open,
                                                  onClose,
                                                  address,
                                                  onDisconnect,
                                                  onCopyAddress,
                                                  copied,
                                              }: SolanaDisconnectModalProps) {
    const short = `${address.slice(0, 6)}…${address.slice(-4)}`

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperComponent={(props) => (
                <Paper
                    {...props}
                    sx={{
                        m: 0,
                        p: 2,
                        borderRadius: 2,
                        width: 360,
                        height: 240,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                />
            )}
        >
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, mb: 1 }}>
                {short}
            </DialogTitle>

            <DialogContent sx={{ flexGrow: 1, p: 0 }}>
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Tooltip title={address} arrow>
                        <Button
                            onClick={() => {
                                onCopyAddress()
                                onClose()
                            }}
                            variant="contained"
                            startIcon={copied ? <Check size={22} /> : <Copy size={22} />}
                            sx={{
                                width: 160,
                                height: 55,
                                textTransform: 'none',
                                borderRadius: 1,
                                fontSize: '15px',
                                color: 'white'
                            }}
                        >
                            Copy Address
                        </Button>
                    </Tooltip>

                    <Button
                        onClick={() => {
                            onDisconnect()
                            onClose()
                        }}
                        variant="contained"
                        color="error"
                        sx={{
                            width: 160,
                            height: 55,
                            textTransform: 'none',
                            borderRadius: 1,
                            fontSize: '15px',
                        }}
                    >
                        Disconnect
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
