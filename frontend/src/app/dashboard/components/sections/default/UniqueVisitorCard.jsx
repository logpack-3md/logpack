'use client';

import MainCard from '../../cards/MainCard';
import { Box, Stack, Typography } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

export default function UniqueVisitorCard() {
  const series = [70];
  const options = {
    chart: { type: 'radialBar' },
    plotOptions: {
      radialBar: {
        hollow: { size: '65%' },
        track: { background: '#e6e6e6' },
        dataLabels: {
          show: true,
          name: { show: false },
          value: { fontSize: '1.5rem', fontWeight: 600 },
        },
      },
    },
    colors: ['#556cd6'],
    labels: ['Visitors'],
  };

  return (
    <MainCard>
      <Stack spacing={2}>
        <Typography variant="h5">Unique Visitors</Typography>
        <Box sx={{ textAlign: 'center' }}>
          <ReactApexChart options={options} series={series} type="radialBar" height={250} />
          <Typography variant="h4">2,300</Typography>
          <Typography variant="body2" color="text.secondary">
            +12% from last month
          </Typography>
        </Box>
      </Stack>
    </MainCard>
  );
}