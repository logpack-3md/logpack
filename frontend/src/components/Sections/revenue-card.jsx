'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart as MiniLine } from '@mui/x-charts/LineChart'; // Mini chart

const revenueData = [
  { x: 'Jan', y: 400 },
  { x: 'Feb', y: 430 },
  { x: 'Mar', y: 448 },
  { x: 'Apr', y: 470 },
  { x: 'May', y: 540 },
  { x: 'Jun', y: 580 },
];

export default function RevenueCard() {
  return (
    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 1 }}>Revenue</Typography>
        <Typography variant="h3" sx={{ mb: 2 }}>$48,392</Typography>
        <Box sx={{ height: 200 }}>
          <MiniLine
            xAxis={[{ scaleType: 'point', data: revenueData.map(d => d.x) }]}
            series={[{ data: revenueData.map(d => d.y), color: 'white' }]}
            height={200}
            disableAxis={true}
          />
        </Box>
      </CardContent>
    </Card>
  );
}