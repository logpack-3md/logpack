'use client';

import MainCard from '../../cards/MainCard';
import { Box, Stack, Typography } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

export default function SaleReportCard() {
  const series = [
    { name: 'Sales', data: [31, 40, 28, 51, 42, 109, 100] },
    { name: 'Revenue', data: [11, 32, 45, 32, 34, 52, 41] },
  ];
  const options = {
    chart: { type: 'area', toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    colors: ['#556cd6', '#19857b'],
  };

  return (
    <MainCard>
      <Stack spacing={2}>
        <Typography variant="h5">Sales Report</Typography>
        <Box>
          <ReactApexChart options={options} series={series} type="area" height={300} />
        </Box>
      </Stack>
    </MainCard>
  );
}