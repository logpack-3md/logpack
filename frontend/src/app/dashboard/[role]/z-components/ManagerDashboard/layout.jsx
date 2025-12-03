// app/dashboard/layout.jsx
'use client';

import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../Dashboards/theme';
import Sidebar from '../layout/sidebar';

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(true);
  const handleToggle = () => setOpen(!open);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar open={open} onToggle={handleToggle} />

        {/* Main Content - ÚNICA ROLAGEM */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            ml: { lg: open ? '280px' : '73px' },
            transition: 'margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          }}
        >
          {/* ROLAGEM AQUI - SÓ UMA */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              p: { xs: 2, lg: 3 },
              pb: 4,
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}