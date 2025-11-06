// app/dashboard/page.jsx
'use client';
//não tem o arquivo appnewsupdate
import { Grid, Container, Typography } from '@mui/material';
import { AttachMoney, People, ShoppingCart, BugReport } from '@mui/icons-material';
import AppWidgetSummary from './components/sections/default/AppWidgetSummary';
import AppCurrentVisits from './components/sections/default/AppCurrentVisits';
import AppWebsiteVisits from './components/sections/default/AppWebsiteVisits';
// import AppNewsUpdate from './components/sections/default/AppNewsUpdate';
import AppTrafficBySite from './components/sections/default/AppTrafficBySite';

export default function DashboardApp() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>Hi, Welcome back</Typography>

      {/* 4 CARDS GRANDES NO TOPO */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="Weekly Sales" total="$15k" icon={<AttachMoney />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="New Users" total="1,350" icon={<People />} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="Item Orders" total="1,720" icon={<ShoppingCart />} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="Bug Reports" total="234" icon={<BugReport />} color="error" />
        </Grid>

        {/* GRÁFICOS GRANDES */}
        <Grid item xs={12} md={8}>
          <AppCurrentVisits />
        </Grid>
        <Grid item xs={12} md={4}>
          <AppWebsiteVisits />
        </Grid>

        {/* OUTROS COMPONENTES */}
        <Grid item xs={12} md={6} lg={8}>
          {/* <AppNewsUpdate /> */}
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          {/* <AppOrderTimeline /> */}
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          {/* <AppTasks /> */}
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <AppTrafficBySite />
        </Grid>
      </Grid>
    </Container>
  );
}