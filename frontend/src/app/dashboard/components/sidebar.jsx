'use client';

import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Menu, Dashboard, Folder, BarChart, Settings } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar({ open, handleDrawerToggle }) {
  const theme = useTheme();
  const router = useRouter();
  const [selected, setSelected] = useState('/dashboard');

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Projects', icon: <Folder />, path: '/dashboard/projects' },
    { text: 'Analytics', icon: <BarChart />, path: '/dashboard/analytics' },
    { text: 'Settings', icon: <Settings />, path: '/dashboard/settings' },
  ];

  return (
    <Box component="nav">
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? 240 : 73,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: open ? 240 : 73, boxSizing: 'border-box' },
        }}
      >
        <IconButton onClick={handleDrawerToggle} sx={{ ml: 1, mt: 1 }}>
          <Menu />
        </IconButton>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
                selected={selected === item.path}
                onClick={() => {
                  setSelected(item.path);
                  router.push(item.path);
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}