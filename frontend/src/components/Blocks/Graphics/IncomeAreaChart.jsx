// app/dashboard/sections/dashboard/default/IncomeAreaChart.jsx
'use client';

import { useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { Stack, Typography, Box } from '@mui/material';
import { LineChart } from '@mui/x-charts';

const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const monthlyData1 = [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35];
const weeklyData1 = [31, 40, 28, 51, 42, 109, 100];
const monthlyData2 = [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41];
const weeklyData2 = [11, 32, 45, 32, 34, 52, 41];

function Legend({ items, onToggle }) {
  return (
    <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 2 }}>
      {items.map((item) => (
        <Stack
          key={item.label}
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ cursor: 'pointer' }}
          onClick={() => onToggle(item.label)}
        >
          <Box sx={{ width: 12, height: 12, bgcolor: item.visible ? item.color : 'grey.400', borderRadius: '50%' }} />
          <Typography variant="body2">{item.label}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default function IncomeAreaChart({ view }) {
  const theme = useTheme();
  const [visibility, setVisibility] = useState({ 'Page views': true, Sessions: true });

  const labels = view === 'monthly' ? monthlyLabels : weeklyLabels;
  const data1 = view === 'monthly' ? monthlyData1 : weeklyData1;
  const data2 = view === 'monthly' ? monthlyData2 : weeklyData2;

  const toggle = (label) => {
    setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const series = [
    { data: data1, label: 'Page views', color: theme.palette.primary.main, visible: visibility['Page views'] },
    { data: data2, label: 'Sessions', color: theme.palette.primary[700], visible: visibility['Sessions'] }
  ].filter(s => s.visible);

  return (
    <>
      <LineChart
        height={380}
        series={series.map(s => ({ ...s, area: true, showMark: false }))}
        xAxis={[{ data: labels, scaleType: 'point' }]}
        margin={{ top: 10, bottom: 30, left: 40, right: 20 }}
        sx={{
          '& .MuiAreaElement-root': { fillOpacity: 0.1 },
          '& .MuiLineElement-root': { strokeWidth: 2 }
        }}
      >
        <defs>
          {series.map((s, i) => (
            <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={alpha(s.color, 0.4)} />
              <stop offset="95%" stopColor={alpha(s.color, 0)} />
            </linearGradient>
          ))}
        </defs>
      </LineChart>
      <Legend items={series.map((s, i) => ({ ...s, color: s.color }))} onToggle={toggle} />
    </>
  );
}