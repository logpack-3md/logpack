// app/dashboard/components/Header.jsx
'use client';

import { AppBar, Toolbar, IconButton, Typography, Stack, Avatar } from '@mui/material';
import { Menu, Notifications, Settings } from '@mui/icons-material';

export default function Header({ open, onToggle }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { lg: open ? `calc(100% - 280px)` : `calc(100% - 73px)` },
        ml: { lg: open ? '280px' : '73px' },
        backgroundColor: '#fff',
        color: '#000',
        boxShadow: '0 0 2rem 0 rgba(136,152,170,.15)'
      }}
    >
      <Toolbar>
        <IconButton onClick={onToggle} edge="start" sx={{ mr: 2 }}>
          <Menu />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Dashboard</Typography>
        <Stack direction="row" spacing={1}>
          <IconButton><Notifications /></IconButton>
          <IconButton><Settings /></IconButton>
          <Avatar alt="User" src="/static/mock-images/avatars/avatar_default.jpg" />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}