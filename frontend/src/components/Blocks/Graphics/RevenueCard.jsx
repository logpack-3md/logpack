'use client';

import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { _mock } from '../../../data/_mock';

const CHART_DATA = _mock.dashboard.chart.revenueWeekly;

export default function RevenueCard() {
  return (
    <Card>
      <CardContent sx={{ p: 3, pb: 0 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack spacing={1}>
            <Typography variant="h6">Income Overview</Typography>
            <Typography variant="body2" color="text.secondary">
              This Week Statistics
            </Typography>
            <Typography variant="h3" color="success.main">
              $7,650
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Box sx={{ p: 3, pb: 3 }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={CHART_DATA}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}