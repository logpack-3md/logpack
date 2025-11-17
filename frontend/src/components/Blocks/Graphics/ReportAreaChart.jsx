// app/dashboard/sections/dashboard/default/ReportAreaChart.jsx
'use client';

import { useTheme } from '@mui/material/styles';
import { LineChart } from '@mui/x-charts';

const data = [58, 115, 28, 83, 63, 75, 35];
const labels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ReportAreaChart() {
  const theme = useTheme();
  return (
    <LineChart
      height={200}
      series={[{ data, area: true, showMark: false, color: theme.palette.warning.main }]}
      xAxis={[{ data: labels, scaleType: 'point' }]}
      margin={{ top: 10, bottom: 30, left: 40, right: 20 }}
    />
  );
}