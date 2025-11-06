// app/dashboard/sections/dashboard/default/UniqueVisitorCard.jsx
'use client';

import { useState } from 'react';
import { Button, Grid, Stack, Typography } from '@mui/material';
import MainCard from '../../cards/MainCard';
import IncomeAreaChart from './IncomeAreaChart';

export default function UniqueVisitorCard() {
  const [view, setView] = useState('monthly');

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Unique Visitor</Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              onClick={() => setView('monthly')}
              color={view === 'monthly' ? 'primary' : 'secondary'}
              variant={view === 'monthly' ? 'outlined' : 'text'}
            >
              Month
            </Button>
            <Button
              size="small"
              onClick={() => setView('weekly')}
              color={view === 'weekly' ? 'primary' : 'secondary'}
              variant={view === 'weekly' ? 'outlined' : 'text'}
            >
              Week
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <IncomeAreaChart view={view} />
      </MainCard>
    </>
  );
}