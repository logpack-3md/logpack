'use client';

import { Box } from '@mui/material';
import { useState } from 'react';

import DashboardTheme from './theme';
import Sidebar from './components/sidebar';
import Header from './components/header';

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <DashboardTheme>
      <Box sx={{ display: 'flex' }}>
        <Header open={open} handleDrawerToggle={handleDrawerToggle} />
        <Sidebar open={open} handleDrawerToggle={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: 'background.default',
            minHeight: '100vh',
            width: { sm: `calc(100% - ${open ? 240 : 73}px)` },
            ml: `${open ? 240 : 73}px`,
            transition: (theme) =>
              theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }}
        >
          {children}
        </Box>
      </Box>
    </DashboardTheme>
  );
}