// src/app/estoque/layout.jsx
'use client';

import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../[role]/components/ManagerDashboard/theme';
import Sidebar from '@/components/layout/sidebar';

export default function EstoqueLayout({ children }) {
  const [open, setOpen] = useState(true);
  const handleToggle = () => setOpen(!open);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <ThemeProvider theme={theme}>

      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0000005d] z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            ml: { lg: open ? '' : '73px' },
            transition: 'margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          }}
        >
          <Box sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}