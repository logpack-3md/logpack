// app/dashboard/components/Sidebar.js
'use client';

import { useState } from 'react';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Collapse, IconButton, Divider, Box
} from '@mui/material';
import {
  Dashboard, People, ShoppingCart, BarChart, Settings,
  ExpandLess, ExpandMore, ChevronLeft
} from '@mui/icons-material';

const drawerWidth = 280;
const miniDrawerWidth = 73;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'User', icon: <People />, path: '/dashboard/user' },
  { text: 'Product', icon: <ShoppingCart />, path: '/dashboard/product' },
  { text: 'Blog', icon: <BarChart />, path: '/dashboard/blog' },
  { text: 'Login', icon: <Settings />, path: '/login' }
];

export default function Sidebar({ open, onToggle }) {
  const [openSub, setOpenSub] = useState({});

  const handleClick = (text) => {
    setOpenSub(prev => ({ ...prev, [text]: !prev[text] }));
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : miniDrawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : miniDrawerWidth,
          boxSizing: 'border-box',
          transition: 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          overflowX: 'hidden'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: open ? 'space-between' : 'center' }}>
        {open && <Box sx={{ fontWeight: 700, fontSize: '1.25rem' }}>Minimal</Box>}
        <IconButton onClick={onToggle}>
          <ChevronLeft />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}