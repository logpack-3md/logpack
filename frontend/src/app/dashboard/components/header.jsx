'use client';

import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Menu as MenuIcon, Notifications, AccountCircle } from '@mui/icons-material';
import SearchBar from './search-bar';

export default function Header({ open, handleDrawerToggle }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${open ? 240 : 73}px)` },
        ml: `${open ? 240 : 73}px`,
        transition: (theme) => theme.transitions.create(['width', 'margin'], { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen }),
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <SearchBar />
        <IconButton color="inherit"><Notifications /></IconButton>
        <IconButton color="inherit"><AccountCircle /></IconButton>
      </Toolbar>
    </AppBar>
  );
}