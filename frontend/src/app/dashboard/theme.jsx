// app/dashboard/theme.js
'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#556cd6',
      light: '#7986cb',
      dark: '#303f9f',
      contrastText: '#fff'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: '#f44336'
    },
    warning: {
      main: '#ff9800'
    },
    info: {
      main: '#2196f3'
    },
    success: {
      main: '#4caf50'
    },
    grey: {
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242'
    },
    text: {
      primary: '#212121',
      secondary: '#757575'
    },
    divider: '#e0e0e0',
    background: {
      paper: '#fff',
      default: '#f4f6f8'
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: '"Public Sans", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 700 },
    h3: { fontSize: '1.75rem', fontWeight: 700 },
    h4: { fontSize: '1.5rem', fontWeight: 700 },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    subtitle1: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.75rem' }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 0 2rem 0 rgba(136,152,170,.15)',
          borderRadius: 8,
          '&:hover': {
            boxShadow: '0 0 2rem 0 rgba(136,152,170,.25)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'unset'
        }
      }
    }
  }
});