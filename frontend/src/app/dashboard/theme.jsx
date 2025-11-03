'use client';

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // <-- CORRETO
import { useMemo } from 'react';

const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#556cd6' },
    secondary: { main: '#19857b' },
    background: { default: '#f4f6f8', paper: '#ffffff' },
    text: { primary: '#1a202c' },
  },
  typography: {
    fontFamily: 'Public Sans, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
        },
      },
    },
  },
});

export default function DashboardTheme({ children }) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline /> {/* Agora funciona */}
      {children}
    </ThemeProvider>
  );
}