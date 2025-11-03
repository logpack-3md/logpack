'use client';

import { useState } from 'react';
import {
  Avatar, AvatarGroup, Button, Grid, IconButton, List, ListItem, ListItemAvatar,
  ListItemButton, ListItemText, Menu, MenuItem, Stack, Typography, Box
} from '@mui/material';
import { EllipsisOutlined, GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';

// Componentes
import MainCard from './components/cards/MainCard';
import AnalyticEcommerce from './components/cards/AnalyticEcommerce';
import MonthlyBarChart from './components/sections/default/MonthlyBarChart';
import ReportAreaChart from './components/sections/default/ReportAreaChart';
import UniqueVisitorCard from './components/sections/default/UniqueVisitorCard';
import SaleReportCard from './components/sections/default/SaleReportCard';
import OrdersTable from './components/sections/default/OrdersTable';

// Avatares (CDN)
const avatar1 = 'https://i.pravatar.cc/150?img=1';
const avatar2 = 'https://i.pravatar.cc/150?img=2';
const avatar3 = 'https://i.pravatar.cc/150?img=3';
const avatar4 = 'https://i.pravatar.cc/150?img=4';

const avatarSX = { width: 36, height: 36, fontSize: '1rem' };
const actionSX = { mt: 0.75, ml: 1, top: 'auto', right: 'auto', alignSelf: 'flex-start', transform: 'none' };

export default function DashboardDefault() {
  const [orderMenuAnchor, setOrderMenuAnchor] = useState(null);
  const [analyticsMenuAnchor, setAnalyticsMenuAnchor] = useState(null);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Total Page Views" count="4,42,236" percentage={59.3} extra="35,000" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Total Users" count="78,250" percentage={70.5} extra="8,900" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Total Order" count="18,800" percentage={27.4} isLoss color="warning" extra="1,943" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Total Sales" count="35,078" percentage={27.4} isLoss color="warning" extra="20,395" />
      </Grid>

      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <UniqueVisitorCard />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="h5">Income Overview</Typography></Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="text.secondary">This Week Statistics</Typography>
              <Typography variant="h3">$7,650</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart />
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="h5">Recent Orders</Typography></Grid>
          <Grid>
            <IconButton onClick={(e) => setOrderMenuAnchor(e.currentTarget)}>
              <EllipsisOutlined style={{ fontSize: '1.25rem' }} />
            </IconButton>
            <Menu anchorEl={orderMenuAnchor} open={Boolean(orderMenuAnchor)} onClose={() => setOrderMenuAnchor(null)}>
              <MenuItem>Export as CSV</MenuItem>
              <MenuItem>Export as Excel</MenuItem>
              <MenuItem>Print Table</MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}><OrdersTable /></MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="h5">Analytics Report</Typography></Grid>
          <Grid>
            <IconButton onClick={(e) => setAnalyticsMenuAnchor(e.currentTarget)}>
              <EllipsisOutlined style={{ fontSize: '1.25rem' }} />
            </IconButton>
            <Menu anchorEl={analyticsMenuAnchor} open={Boolean(analyticsMenuAnchor)} onClose={() => setAnalyticsMenuAnchor(null)}>
              <MenuItem>Weekly</MenuItem>
              <MenuItem>Monthly</MenuItem>
              <MenuItem>Yearly</MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider><ListItemText primary="Company Finance Growth" /><Typography variant="h5">+45.14%</Typography></ListItemButton>
            <ListItemButton divider><ListItemText primary="Company Expenses Ratio" /><Typography variant="h5">0.58%</Typography></ListItemButton>
            <ListItemButton><ListItemText primary="Business Risk Cases" /><Typography variant="h5">Low</Typography></ListItemButton>
          </List>
          <ReportAreaChart />
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <SaleReportCard />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="h5">Transaction History</Typography></Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ px: 0, py: 0, '& .MuiListItemButton-root': { py: 1.5, px: 2 } }}>
            <ListItem component={ListItemButton} divider secondaryAction={<Stack alignItems="flex-end"><Typography variant="subtitle1">+ $1,430</Typography><Typography variant="h6" color="secondary">78%</Typography></Stack>}>
              <ListItemAvatar><Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}><GiftOutlined /></Avatar></ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #002434</Typography>} secondary="Today, 2:00 AM" />
            </ListItem>
            <ListItem component={ListItemButton} divider secondaryAction={<Stack alignItems="flex-end"><Typography variant="subtitle1">+ $302</Typography><Typography variant="h6" color="secondary">8%</Typography></Stack>}>
              <ListItemAvatar><Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}><MessageOutlined /></Avatar></ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #984947</Typography>} secondary="5 August, 1:45 PM" />
            </ListItem>
            <ListItem component={ListItemButton} secondaryAction={<Stack alignItems="flex-end"><Typography variant="subtitle1">+ $682</Typography><Typography variant="h6" color="secondary">16%</Typography></Stack>}>
              <ListItemAvatar><Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}><SettingOutlined /></Avatar></ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #988784</Typography>} secondary="7 hours ago" />
            </ListItem>
          </List>
        </MainCard>
        <MainCard sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid>
                <Stack>
                  <Typography variant="h5">Help & Support Chat</Typography>
                  <Typography variant="caption" color="secondary">Typical reply within 5 min</Typography>
                </Stack>
              </Grid>
              <Grid>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  <Avatar alt="User 1" src={avatar1} />
                  <Avatar alt="User 2" src={avatar2} />
                  <Avatar alt="User 3" src={avatar3} />
                  <Avatar alt="User 4" src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained">Need Help?</Button>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}