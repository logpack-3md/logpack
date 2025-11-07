// app/dashboard/sections/dashboard/default/MonthlyBarChart.jsx
'use client';

import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts';

const data = [80, 95, 70, 42, 65, 55, 78];
const xLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function MonthlyBarChart() {
  const theme = useTheme();
  return (
    <BarChart
      height={300}
      series={[{ data }]}
      xAxis={[{ data: xLabels, scaleType: 'band' }]}
      colors={[theme.palette.info.light]}
      slotProps={{ bar: { rx: 5, ry: 5 } }}
      margin={{ top: 10, bottom: 30, left: 40, right: 20 }}
    />
  );
}