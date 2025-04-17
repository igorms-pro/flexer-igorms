import { createTheme } from '@mui/material/styles'

export const getTheme = (mode: 'light' | 'dark') =>
    createTheme({
        palette: {
            mode,
            primary: {
                main: '#00BCD4',
            },
            background: {
                default: mode === 'light' ? '#FFFFFF' : '#121212',
                paper: mode === 'light' ? '#F9F9F9' : '#1E1E1E',
            },
            text: {
                primary: mode === 'light' ? '#000000' : '#FFFFFF',
                secondary: mode === 'light' ? '#6B7280' : '#9CA3AF',
            },
            divider: mode === 'light' ? '#E5E7EB' : '#333333',
        },
        typography: {
            fontFamily: '"Geist", "Inter", "Helvetica", sans-serif',
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: 'none',
                    },
                },
            },
        },
    })
