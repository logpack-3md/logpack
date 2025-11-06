// app/dashboard/layout.jsx
'use client';

import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import Sidebar from './components/sidebar';
import Header from './components/Hader';

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(true);
  const handleToggle = () => setOpen(!open);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Header open={open} onToggle={handleToggle} />
        <Sidebar open={open} onToggle={handleToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: 'background.default',
            minHeight: '100vh',
            ml: { lg: open ? '280px' : '73px' },
            transition: 'margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'
          }}
        >
          <Box sx={{ mt: 8 }}>{children}</Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}