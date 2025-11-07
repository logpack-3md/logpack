// app/dashboard/layout.jsx
'use client';

import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Sidebar from '../../components/layout/sidebar';

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(true);
  const handleToggle = () => setOpen(!open);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar open={open} onToggle={handleToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
            transition: 'margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
            ml: { lg: open ? '280px' : '73px' },
          }}
        >
          <Box sx={{ mt: { xs: 2, lg: 4 } }}>{children}</Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}