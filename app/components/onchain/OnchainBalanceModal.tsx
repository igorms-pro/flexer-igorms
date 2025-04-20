'use client'

import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {formatUsd} from '@/app/utils/balance'
import {TooltipBalanceRow} from './OnChainTypes'

type OnchainBalanceModalProps = {
    open: boolean
    onClose: () => void
    rows: TooltipBalanceRow[]
    totalUsd: number
}

export const OnchainBalanceModal = ({open, onClose, rows, totalUsd}: OnchainBalanceModalProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Balance Breakdown
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{position: 'absolute', right: 8, top: 8}}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {rows.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No token balances to display.
                    </Typography>
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>CHAIN</TableCell>
                                <TableCell>TOKEN</TableCell>
                                <TableCell align="right">BALANCE</TableCell>
                                <TableCell align="right">PRICE</TableCell>
                                <TableCell align="right">TOTAL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{row.chainId}</TableCell>
                                    <TableCell>{row.token}</TableCell>
                                    <TableCell align="right">{row.balance}</TableCell>
                                    <TableCell align="right">{row.price}</TableCell>
                                    <TableCell align="right">{row.total}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <strong>Total USD</strong>
                                </TableCell>
                                <TableCell align="right">
                                    <strong>{formatUsd(totalUsd)}</strong>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                )}
            </DialogContent>
        </Dialog>
    )
}
